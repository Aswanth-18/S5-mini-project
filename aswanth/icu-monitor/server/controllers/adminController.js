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
  const [totalPatients, criticalPatients, activePatients, totalBeds, occupiedBeds, activeAlerts, unacknowledgedAlerts, resolvedAlerts] = await Promise.all([
    Patient.countDocuments({ status: { $ne: 'discharged' } }),
    Patient.countDocuments({ status: 'critical' }),
    Patient.countDocuments({ status: { $ne: 'discharged' } }),
    Bed.countDocuments(),
    Bed.countDocuments({ isOccupied: true }),
    Alert.countDocuments({ status: 'active' }),
    Alert.countDocuments({ status: { $in: ['active', 'acknowledged'] } }),
    Alert.countDocuments({ status: 'resolved' })
  ]);

  const occupancyRate = totalBeds ? Number(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0;

  res.json({
    totalPatients,
    criticalPatients,
    activePatients,
    totalBeds,
    occupiedBeds,
    availableBeds: Math.max(totalBeds - occupiedBeds, 0),
    occupancyRate,
    activeAlerts,
    unacknowledgedAlerts,
    resolvedAlerts
  });
});