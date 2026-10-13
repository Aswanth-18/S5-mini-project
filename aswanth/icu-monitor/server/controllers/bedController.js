const Bed = require('../models/Bed');
const asyncHandler = require('../utils/asyncHandler');

exports.getBeds = asyncHandler(async (req, res) => {
  const beds = await Bed.find().populate('currentPatient', 'name patientId status riskLevel');
  res.json(beds);
});

exports.createBed = asyncHandler(async (req, res) => {
  const bed = await Bed.create(req.body);
  res.status(201).json(bed);
});