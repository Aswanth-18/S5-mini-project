const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getPatients, getPatient, admitPatient, updatePatient, dischargePatient
} = require('../controllers/patientController');

router.use(protect);

router.route('/')
  .get(authorize('admin', 'doctor', 'nurse'), getPatients)
  .post(authorize('admin', 'doctor'), admitPatient);

router.route('/:id')
  .get(authorize('admin', 'doctor', 'nurse'), getPatient)
  .patch(authorize('admin', 'doctor'), updatePatient);

router.patch('/:id/discharge', authorize('doctor'), dischargePatient);

module.exports = router;