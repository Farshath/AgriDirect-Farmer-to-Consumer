const Category = require('../models/Category');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (ADMIN)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      icon: icon || 'Sprout',
    });

    return res.status(201).json({
      success: true,
      message: 'Category created',
      category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory };

