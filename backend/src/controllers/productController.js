const Product = require('../models/Product');
const Category = require('../models/Category');
const FarmerProfile = require('../models/FarmerProfile');
const Review = require('../models/Review');

// Helper to escape user inputs for safe regex queries
const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @desc    Get all active products with filters, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      isOrganic,
      minPrice,
      maxPrice,
      state,
      district,
      availability,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true, isApproved: true };

    // Search keyword (matches name, description, farm location, village, district, state)
    if (search && search.trim()) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { name: new RegExp(safeSearch, 'i') },
        { description: new RegExp(safeSearch, 'i') },
        { farmLocation: new RegExp(safeSearch, 'i') },
        { village: new RegExp(safeSearch, 'i') },
        { district: new RegExp(safeSearch, 'i') },
        { state: new RegExp(safeSearch, 'i') },
      ];
    }

    // Availability filter
    if (availability === 'in-stock' || availability === 'inStock') {
      query.availableQuantity = { $gt: 0 };
    } else if (availability === 'out-of-stock' || availability === 'outOfStock') {
      query.availableQuantity = { $lte: 0 };
    }

    // Category filter by ID or slug
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // Organic filter
    if (isOrganic !== undefined && isOrganic !== '') {
      query.isOrganic = isOrganic === 'true' || isOrganic === true;
    }

    // Location filter
    if (state && state.trim()) {
      query.state = new RegExp(escapeRegex(state), 'i');
    }
    if (district && district.trim()) {
      query.district = new RegExp(escapeRegex(district), 'i');
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate('category', 'name slug icon')
      .populate('farmer', 'name email phone avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Attach farmer profiles to product results
    const farmerUserIds = [...new Set(products.map((p) => p.farmer?._id?.toString()).filter(Boolean))];
    const farmerProfiles = await FarmerProfile.find({ user: { $in: farmerUserIds } });
    const profileMap = {};
    farmerProfiles.forEach((fp) => {
      profileMap[fp.user.toString()] = fp;
    });

    const enrichedProducts = products.map((p) => {
      const pObj = p.toObject();
      pObj.farmerProfile = p.farmer ? profileMap[p.farmer._id.toString()] || null : null;
      return pObj;
    });

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products: enrichedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug description icon')
      .populate('farmer', 'name email phone avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const farmerProfile = await FarmerProfile.findOne({ user: product.farmer._id });
    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const pObj = product.toObject();
    pObj.farmerProfile = farmerProfile;
    pObj.reviewsList = reviews;

    return res.status(200).json({
      success: true,
      product: pObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product listing
// @route   POST /api/products
// @access  Private (FARMER)
const createProduct = async (req, res, next) => {
  try {
    // Check farmer verification status
    const profile = await FarmerProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your farm profile before listing products',
      });
    }

    if (profile.verificationStatus !== 'APPROVED') {
      return res.status(403).json({
        success: false,
        message: 'Your farmer account is currently pending verification. Only approved farmers can publish live products.',
      });
    }

    const {
      name,
      description,
      category,
      price,
      unit,
      availableQuantity,
      minOrderQuantity,
      images,
      isOrganic,
      harvestDate,
      tags,
    } = req.body;

    if (!name || !description || !category || price === undefined || availableQuantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, price, and available quantity are required',
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product price must be greater than zero',
      });
    }

    if (Number(availableQuantity) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Available quantity cannot be negative',
      });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const product = await Product.create({
      farmer: req.user._id,
      name,
      slug,
      description,
      category,
      price: Number(price),
      unit: unit || 'kg',
      availableQuantity: Number(availableQuantity),
      minOrderQuantity: Number(minOrderQuantity) || 1,
      images: Array.isArray(images) && images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'],
      isOrganic: isOrganic !== undefined ? isOrganic : true,
      harvestDate: harvestDate || new Date(),
      farmLocation: profile.farmLocation || `${profile.district}, ${profile.state}`,
      district: profile.district,
      state: profile.state,
      tags: tags || [],
      isActive: true,
      isApproved: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Product listed successfully!',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (FARMER or ADMIN)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Ownership check
    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this product',
      });
    }

    const {
      name,
      description,
      category,
      price,
      unit,
      availableQuantity,
      minOrderQuantity,
      images,
      isOrganic,
      harvestDate,
      isActive,
      tags,
    } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price !== undefined) {
      if (Number(price) <= 0) {
        return res.status(400).json({ success: false, message: 'Price must be positive' });
      }
      product.price = Number(price);
    }
    if (unit) product.unit = unit;
    if (availableQuantity !== undefined) {
      if (Number(availableQuantity) < 0) {
        return res.status(400).json({ success: false, message: 'Quantity cannot be negative' });
      }
      product.availableQuantity = Number(availableQuantity);
    }
    if (minOrderQuantity !== undefined) product.minOrderQuantity = Number(minOrderQuantity);
    if (images && images.length > 0) product.images = images;
    if (isOrganic !== undefined) product.isOrganic = isOrganic;
    if (harvestDate) product.harvestDate = harvestDate;
    if (isActive !== undefined) product.isActive = isActive;
    if (tags) product.tags = tags;

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (FARMER or ADMIN)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current farmer's products
// @route   GET /api/products/farmer/my-products
// @access  Private (FARMER)
const getMyFarmerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick stock & active status update
// @route   PATCH /api/products/:id/stock
// @access  Private (FARMER)
const updateStock = async (req, res, next) => {
  try {
    const { availableQuantity, quantity, isActive } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const targetQty = availableQuantity !== undefined ? availableQuantity : quantity;
    if (targetQty !== undefined) {
      if (Number(targetQty) < 0) {
        return res.status(400).json({ success: false, message: 'Quantity cannot be negative' });
      }
      product.availableQuantity = Number(targetQty);
    }

    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyFarmerProducts,
  updateStock,
};

