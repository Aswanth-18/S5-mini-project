const AuditLog = require('../models/AuditLog');
const Patient = require('../models/Patient');
const Alert = require('../models/Alert');
const Bed = require('../models/Bed');
const asyncHandler = require('../utils/asyncHandler');

exports.getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find().populate('user', 'name role').sort({ createdAt: -1 }).limit(300);
  res.json(logs);
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [total, critical, active, beds, alerts, resolved] = await Promise.all([
    Patient.countDocuments(),
    Patient.countDocuments({ status: 'critical' }),
    Patient.countDocuments({ status: { $ne: 'discharged' } }),
    Bed.countDocuments(),
    Alert.countDocuments({ status: 'active' }),
    Alert.countDocuments({ status: 'resolved' })
  ]);
  res.json({ totalPatients: total, criticalPatients: critical, activePatients: active, totalBeds: beds, activeAlerts: alerts, resolvedAlerts: resolved });
});