const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { getBeds, createBed } = require('../controllers/bedController');

router.use(protect);
router.get('/', getBeds);
router.post('/', authorize('admin'), createBed);

module.exports = router;