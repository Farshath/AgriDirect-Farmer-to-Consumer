const express = require('express');
const router = express.Router();
const {
  getFarmers,
  getFarmerById,
  updateFarmerProfile,
  getFarmerDashboard,
} = require('../controllers/farmerController');
const { register } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Dedicated farmer registration route: POST /api/farmers/register
router.post('/register', (req, res, next) => {
  req.body.role = 'FARMER';
  return register(req, res, next);
});

router.get('/', getFarmers);
router.get('/dashboard', protect, authorize('FARMER'), getFarmerDashboard);
router.put('/profile', protect, authorize('FARMER'), updateFarmerProfile);
router.get('/:id', getFarmerById);

module.exports = router;

