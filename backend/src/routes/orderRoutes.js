const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/', protect, authorize('CUSTOMER'), createOrder);
router.get('/my-orders', protect, authorize('CUSTOMER'), getMyOrders);
router.get('/farmer-orders', protect, authorize('FARMER'), getFarmerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('FARMER', 'ADMIN'), updateOrderStatus);

module.exports = router;

