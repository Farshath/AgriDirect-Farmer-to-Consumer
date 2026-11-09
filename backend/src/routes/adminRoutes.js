const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAdminFarmers,
  approveFarmer,
  rejectFarmer,
  getAdminCustomers,
  getAdminOrders,
  getAdminAnalytics,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect, authorize('ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.get('/farmers', getAdminFarmers);
router.put('/farmers/:id/approve', approveFarmer);
router.put('/farmers/:id/reject', rejectFarmer);
router.get('/customers', getAdminCustomers);
router.get('/orders', getAdminOrders);
router.get('/analytics', getAdminAnalytics);
router.put('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;

