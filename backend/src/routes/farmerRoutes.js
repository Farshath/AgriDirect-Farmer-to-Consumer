const express = require('express');
const router = express.Router();
const {
  getFarmers,
  getFarmerById,
  updateFarmerProfile,
  getFarmerDashboard,
} = require('../controllers/farmerController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', getFarmers);
router.get('/dashboard', protect, authorize('FARMER'), getFarmerDashboard);
router.put('/profile', protect, authorize('FARMER'), updateFarmerProfile);
router.get('/:id', getFarmerById);

module.exports = router;

