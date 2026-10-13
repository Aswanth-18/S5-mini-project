
const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true, unique: true, trim: true },
  ward: { type: String, default: 'ICU', trim: true },
  room: { type: String, trim: true },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'cleaning', 'maintenance', 'unavailable'],
    default: 'available'
  },
  isOccupied: { type: Boolean, default: false },
  currentPatient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
}, { timestamps: true });

bedSchema.pre('save', function nextHook(next) {
  if (this.currentPatient) {
    this.status = 'occupied';
    this.isOccupied = true;
  } else if (this.status === 'occupied') {
    this.status = 'available';
    this.isOccupied = false;
  }
  next();
});

module.exports = mongoose.model('Bed', bedSchema);