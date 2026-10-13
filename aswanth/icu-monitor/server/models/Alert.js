const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  type: { type: String, required: true },     // "Low SpO2", "Tachycardia", "AI: Respiratory Distress Pattern"
  message: { type: String, required: true },
  priority: { type: String, enum: ['critical', 'high', 'medium', 'low'], default: 'medium' },
  source: { type: String, enum: ['threshold', 'ai'], default: 'threshold' },
  vitalsSnapshot: Object,                     // vitals that triggered it
  status: { type: String, enum: ['active', 'acknowledged', 'resolved'], default: 'active' },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acknowledgedAt: Date,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  escalated: { type: Boolean, default: false },
  escalatedAt: Date
}, { timestamps: true });

alertSchema.index({ status: 1, priority: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);