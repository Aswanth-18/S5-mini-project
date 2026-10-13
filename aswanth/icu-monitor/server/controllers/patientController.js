const Patient = require('../models/Patient');
const Bed = require('../models/Bed');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const audit = require('../services/auditService');

exports.getPatients = asyncHandler(async (req, res) => {
  const { status, search, doctor } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (doctor) filter.assignedDoctor = doctor;
  if (req.user.role === 'doctor') filter.assignedDoctor = req.user._id;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { patientId: new RegExp(search, 'i') },
      { diagnosis: new RegExp(search, 'i') }
    ];
  }
  const patients = await Patient.find(filter)
    .populate('assignedDoctor', 'name specialization')
    .populate('assignedNurses', 'name')
    .populate('icuBed', 'bedNumber')
    .sort({ riskScore: -1 });   // highest risk first!
  res.json(patients);
});

exports.getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate('assignedDoctor', 'name specialization')
    .populate('assignedNurses', 'name')
    .populate('icuBed', 'bedNumber');
  if (!patient) throw new ApiError(404, 'Patient not found');
  audit.log(req, 'VIEW_PATIENT', 'Patient', patient._id);
  res.json(patient);
});

exports.admitPatient = asyncHandler(async (req, res) => {
  const bed = await Bed.findById(req.body.icuBed);
  if (!bed) throw new ApiError(400, 'Invalid bed');
  if (bed.isOccupied) throw new ApiError(400, `Bed ${bed.bedNumber} is occupied`);

  const count = await Patient.countDocuments();
  req.body.patientId = req.body.patientId || `P${1001 + count}`;

  const patient = await Patient.create(req.body);
  bed.isOccupied = true;
  bed.currentPatient = patient._id;
  await bed.save();
  audit.log(req, 'ADMIT_PATIENT', 'Patient', patient._id, `Bed ${bed.bedNumber}`);
  res.status(201).json(patient);
});

exports.updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!patient) throw new ApiError(404, 'Patient not found');
  audit.log(req, 'UPDATE_PATIENT', 'Patient', patient._id);
  res.json(patient);
});

exports.dischargePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { status: 'discharged', dischargedAt: new Date() },
    { new: true }
  );
  if (!patient) throw new ApiError(404, 'Patient not found');
  await Bed.findByIdAndUpdate(patient.icuBed, { isOccupied: false, currentPatient: null });
  audit.log(req, 'DISCHARGE_PATIENT', 'Patient', patient._id);
  res.json({ message: 'Patient discharged', patient });
});