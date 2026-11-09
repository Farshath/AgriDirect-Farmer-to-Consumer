const Review = require('../models/Review');
const Product = require('../models/Product');
const FarmerProfile = require('../models/FarmerProfile');
const Order = require('../models/Order');

// @desc    Add review for a product & farmer
// @route   POST /api/reviews
// @access  Private (CUSTOMER)
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product, rating (1-5), and comment are required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Verify if customer has bought this product
    const hasPurchased = await Order.findOne({
      customer: req.user._id,
      'items.product': productId,
      orderStatus: 'Delivered',
    });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      farmer: product.farmer,
      rating: Number(rating),
      comment,
      isVerifiedPurchase: !!hasPurchased,
    });

    // Recalculate product rating
    const allProductReviews = await Review.find({ product: productId });
    const avgProductRating =
      allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) /
      allProductReviews.length;

    product.rating = Math.round(avgProductRating * 10) / 10;
    product.numReviews = allProductReviews.length;
    await product.save();

    // Recalculate farmer rating
    const allFarmerReviews = await Review.find({ farmer: product.farmer });
    const avgFarmerRating =
      allFarmerReviews.reduce((acc, curr) => acc + curr.rating, 0) /
      allFarmerReviews.length;

    await FarmerProfile.findOneAndUpdate(
      { user: product.farmer },
      {
        rating: Math.round(avgFarmerRating * 10) / 10,
        numReviews: allFarmerReviews.length,
      }
    );

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getProductReviews };

