
const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true, unique: true },   // "ICU-01"
  ward: { type: String, default: 'ICU' },
  isOccupied: { type: Boolean, default: false },
  currentPatient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
}, { timestamps: true });

module.exports = mongoose.model('Bed', bedSchema);