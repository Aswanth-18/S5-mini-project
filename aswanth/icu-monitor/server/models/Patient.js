const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, required: true },   // e.g. "P1001"
  name: { type: String, required: true, trim: true },
  age: { type: Number, min: 0, max: 120 },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  diagnosis: String,
  medicalHistory: String,
  allergies: [String],
  icuBed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', required: true },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedNurses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['stable', 'serious', 'critical', 'discharged'], default: 'stable' },

  // AI fields (updated by aiService)
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  riskScore: { type: Number, default: 0, min: 0, max: 10 },
  aiSummary: String,
  aiReasoning: [String],
  aiUpdatedAt: Date,

  admittedAt: { type: Date, default: Date.now },
  dischargedAt: Date
}, { timestamps: true });

// Text index for the search bar
patientSchema.index({ name: 'text', patientId: 'text', diagnosis: 'text' });

module.exports = mongoose.model('Patient', patientSchema);