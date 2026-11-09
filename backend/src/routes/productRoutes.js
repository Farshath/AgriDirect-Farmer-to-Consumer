const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyFarmerProducts,
  updateStock,
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/', getProducts);
router.get('/farmer/my-products', protect, authorize('FARMER'), getMyFarmerProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('FARMER'), createProduct);
router.put('/:id', protect, authorize('FARMER', 'ADMIN'), updateProduct);
router.delete('/:id', protect, authorize('FARMER', 'ADMIN'), deleteProduct);
router.patch('/:id/stock', protect, authorize('FARMER', 'ADMIN'), updateStock);

module.exports = router;

