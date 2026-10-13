const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Bed = require('../models/Bed');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const audit = require('../services/auditService');
const {
  buildPatientFilter,
  normalizePatientPayload,
  isBedAssignable
} = require('../services/patientWorkflow');

exports.getPatients = asyncHandler(async (req, res) => {
  const { filter, sort, limit, skip, page } = buildPatientFilter({
    ...req.query,
    doctor: req.user.role === 'doctor' ? req.user._id : req.query.doctor
  });

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .populate('assignedDoctor', 'name specialization')
      .populate('assignedNurses', 'name')
      .populate('icuBed', 'bedNumber ward')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Patient.countDocuments(filter)
  ]);

  const payload = { items: patients, total, page, pages: Math.ceil(total / limit), limit };
  const shouldPaginate = req.query.page || req.query.limit;
  res.json(shouldPaginate ? payload : patients);
});

exports.getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate('assignedDoctor', 'name specialization')
    .populate('assignedNurses', 'name')
    .populate('icuBed', 'bedNumber ward room status')
    .populate('attendingPhysician', 'name specialization');

  if (!patient) throw new ApiError(404, 'Patient not found');
  if (req.user.role === 'doctor' && patient.assignedDoctor?.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not assigned to this patient.');
  }

  audit.log(req, 'VIEW_PATIENT', 'Patient', patient._id);
  res.json(patient);
});

exports.admitPatient = asyncHandler(async (req, res) => {
  const payload = normalizePatientPayload(req.body);

  if (!payload.icuBed) throw new ApiError(400, 'ICU bed is required for admission.');
  if (!payload.patientId) throw new ApiError(400, 'A patient identifier is required.');

  const [existingPatient, bed] = await Promise.all([
    Patient.findOne({ patientId: payload.patientId }),
    Bed.findById(payload.icuBed)
  ]);

  if (existingPatient) throw new ApiError(409, `Patient identifier ${payload.patientId} already exists.`);
  if (!bed) throw new ApiError(400, 'Invalid bed selected.');
  if (!isBedAssignable(bed)) throw new ApiError(400, `Bed ${bed.bedNumber} is not available for admission.`);

  const patient = await Patient.create({
    ...payload,
    ward: payload.ward || bed.ward,
    status: payload.status || 'stable',
    admittedAt: new Date()
  });

  bed.status = 'occupied';
  bed.isOccupied = true;
  bed.currentPatient = patient._id;
  await bed.save();

  patient.icuBed = bed._id;
  await patient.save();

  audit.log(req, 'ADMIT_PATIENT', 'Patient', patient._id, `Bed ${bed.bedNumber}`);
  res.status(201).json(patient);
});

exports.updatePatient = asyncHandler(async (req, res) => {
  const payload = normalizePatientPayload(req.body, { isUpdate: true });
  const currentPatient = await Patient.findById(req.params.id);
  if (!currentPatient) throw new ApiError(404, 'Patient not found');

  if (payload.icuBed && payload.icuBed.toString() !== currentPatient.icuBed?.toString()) {
    const targetBed = await Bed.findById(payload.icuBed);
    if (!targetBed) throw new ApiError(400, 'Bed not found.');
    if (!isBedAssignable(targetBed)) {
      throw new ApiError(400, `Bed ${targetBed.bedNumber} is not available for transfer.`);
    }

    if (currentPatient.icuBed) {
      const oldBed = await Bed.findById(currentPatient.icuBed);
      if (oldBed) {
        oldBed.currentPatient = null;
        oldBed.isOccupied = false;
        oldBed.status = 'available';
        await oldBed.save();
      }
    }

    targetBed.currentPatient = currentPatient._id;
    targetBed.isOccupied = true;
    targetBed.status = 'occupied';
    await targetBed.save();
  }

  const patient = await Patient.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
    context: 'query'
  });

  audit.log(req, 'UPDATE_PATIENT', 'Patient', patient._id);
  res.json(patient);
});

exports.dischargePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) throw new ApiError(404, 'Patient not found');

  patient.status = 'discharged';
  patient.dischargedAt = new Date();
  patient.dischargeSummary = patient.dischargeSummary || 'Discharged from ICU care.';

  if (patient.icuBed) {
    const bed = await Bed.findById(patient.icuBed);
    if (bed) {
      bed.currentPatient = null;
      bed.isOccupied = false;
      bed.status = 'available';
      await bed.save();
    }
  }

  await patient.save();
  audit.log(req, 'DISCHARGE_PATIENT', 'Patient', patient._id);
  res.json({ message: 'Patient discharged', patient });
});