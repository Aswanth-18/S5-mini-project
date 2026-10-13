const Alert = require('../models/Alert');
const RANGES = require('../utils/vitalRanges');

const RULES = [
  { key: 'spo2', label: 'SpO₂', sev: 'critical', direction: 'below' },
  { key: 'heartRate', label: 'Heart Rate', sev: 'high' },
  { key: 'systolic', label: 'Systolic BP', sev: 'high' },
  { key: 'diastolic', label: 'Diastolic BP', sev: 'medium' },
  { key: 'temperature', label: 'Temperature', sev: 'medium' },
  { key: 'respiratoryRate', label: 'Respiratory Rate', sev: 'high' }
];

// Returns list of threshold alerts generated for this vital reading
exports.checkVitals = async (patient, vital) => {
  const created = [];
  for (const rule of RULES) {
    const val = vital[rule.key];
    const range = RANGES[rule.key];
    if (val == null) continue;
    let msg = null;
    if (rule.direction === 'below') {
      if (val < range.min) msg = `${rule.label} critically low: ${val} (min ${range.min})`;
    } else {
      if (val > range.max) msg = `${rule.label} high: ${val} (max ${range.max})`;
      else if (val < range.min) msg = `${rule.label} low: ${val} (min ${range.min})`;
    }
    if (msg) {
      const alertType = `Abnormal ${rule.label}`;
      let alert = await Alert.findOne({
        patient: patient._id,
        type: alertType,
        status: 'active'
      });

      const priority = val < range.min - (range.max - range.min) * 0.2 ? 'critical' : rule.sev;
      const snapshot = vital.toObject ? vital.toObject() : { ...vital };

      if (alert) {
        alert.message = msg;
        alert.priority = priority;
        alert.vitalsSnapshot = snapshot;
        alert.source = 'threshold';
        await alert.save();
        created.push(alert);
        continue;
      }

      alert = await Alert.create({
        patient: patient._id, type: alertType, message: msg,
        priority,
        source: 'threshold', vitalsSnapshot: snapshot
      });
      created.push(alert);
    }
  }
  return created;
};