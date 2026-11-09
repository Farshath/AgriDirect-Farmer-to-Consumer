const express = require('express');
const router = express.Router();
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.get('/:productId', getProductReviews);
router.post('/', protect, authorize('CUSTOMER'), createReview);

module.exports = router;

