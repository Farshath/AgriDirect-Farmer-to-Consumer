const FarmerProfile = require('../models/FarmerProfile');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all verified farmers (Public Directory)
// @route   GET /api/farmers
// @access  Public
const getFarmers = async (req, res, next) => {
  try {
    const { search, state, district, cropType, page = 1, limit = 12 } = req.query;

    const query = { verificationStatus: 'APPROVED' };

    if (state) {
      query.state = new RegExp(state, 'i');
    }
    if (district) {
      query.district = new RegExp(district, 'i');
    }
    if (cropType) {
      query.cropTypes = { $in: [new RegExp(cropType, 'i')] };
    }
    if (search) {
      query.$or = [
        { farmName: new RegExp(search, 'i') },
        { farmLocation: new RegExp(search, 'i') },
        { farmDescription: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await FarmerProfile.countDocuments(query);
    const farmers = await FarmerProfile.find(query)
      .populate('user', 'name email phone avatar')
      .skip(skip)
      .limit(Number(limit))
      .sort({ rating: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      farmers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farmer details with products & reviews
// @route   GET /api/farmers/:id
// @access  Public
const getFarmerById = async (req, res, next) => {
  try {
    const farmerProfile = await FarmerProfile.findOne({
      $or: [{ _id: req.params.id }, { user: req.params.id }],
    }).populate('user', 'name email phone avatar createdAt');

    if (!farmerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Farmer profile not found',
      });
    }

    // Fetch active products of this farmer
    const products = await Product.find({
      farmer: farmerProfile.user._id,
      isActive: true,
    }).populate('category', 'name slug');

    return res.status(200).json({
      success: true,
      farmer: farmerProfile,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farmer profile
// @route   PUT /api/farmers/profile
// @access  Private (FARMER)
const updateFarmerProfile = async (req, res, next) => {
  try {
    let profile = await FarmerProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new FarmerProfile({ user: req.user._id });
    }

    const {
      farmName,
      farmLocation,
      village,
      district,
      state,
      pincode,
      farmDescription,
      farmingMethod,
      cropTypes,
      experienceYears,
      totalAreaAcres,
      profileImage,
      coverImage,
      documents,
    } = req.body;

    if (farmName) profile.farmName = farmName;
    if (farmLocation) profile.farmLocation = farmLocation;
    if (village !== undefined) profile.village = village;
    if (district) profile.district = district;
    if (state) profile.state = state;
    if (pincode !== undefined) profile.pincode = pincode;
    if (farmDescription) profile.farmDescription = farmDescription;
    if (farmingMethod) profile.farmingMethod = farmingMethod;
    if (cropTypes) profile.cropTypes = cropTypes;
    if (experienceYears !== undefined) profile.experienceYears = experienceYears;
    if (totalAreaAcres !== undefined) profile.totalAreaAcres = totalAreaAcres;
    if (profileImage) profile.profileImage = profileImage;
    if (coverImage) profile.coverImage = coverImage;
    if (documents) profile.documents = documents;

    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Farm profile updated successfully',
      farmer: profile,
      profile: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer dashboard statistics & charts
// @route   GET /api/farmers/dashboard
// @access  Private (FARMER)
const getFarmerDashboard = async (req, res, next) => {
  try {
    const farmerId = req.user._id;

    // 1. Products stats
    const totalProducts = await Product.countDocuments({ farmer: farmerId });
    const activeProducts = await Product.countDocuments({ farmer: farmerId, isActive: true });
    const outOfStockProducts = await Product.countDocuments({ farmer: farmerId, availableQuantity: 0 });

    // 2. Orders stats where item belongs to this farmer
    const allFarmerOrders = await Order.find({ 'items.farmer': farmerId });

    let totalOrders = allFarmerOrders.length;
    let pendingOrders = 0;
    let completedOrders = 0;
    let totalEarnings = 0;

    allFarmerOrders.forEach((order) => {
      if (['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus)) {
        pendingOrders += 1;
      }
      if (order.orderStatus === 'Delivered') {
        completedOrders += 1;
      }

      // Calculate farmer's specific portion in each order
      order.items.forEach((item) => {
        if (item.farmer.toString() === farmerId.toString()) {
          // If order is not cancelled, add to earnings
          if (order.orderStatus !== 'Cancelled') {
            totalEarnings += item.price * item.quantity;
          }
        }
      });
    });

    // 3. Monthly sales chart data (last 6 months)
    const monthlyMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize past 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyMap[key] = { month: key, sales: 0, orders: 0 };
    }

    allFarmerOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const key = `${months[orderDate.getMonth()]} ${orderDate.getFullYear().toString().slice(-2)}`;
      if (monthlyMap[key]) {
        monthlyMap[key].orders += 1;
        order.items.forEach((item) => {
          if (item.farmer.toString() === farmerId.toString() && order.orderStatus !== 'Cancelled') {
            monthlyMap[key].sales += item.price * item.quantity;
          }
        });
      }
    });

    const monthlySales = Object.values(monthlyMap);

    // 4. Recent orders
    const recentOrders = await Order.find({ 'items.farmer': farmerId })
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Verification status
    const profile = await FarmerProfile.findOne({ user: farmerId });

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalEarnings,
        verificationStatus: profile ? profile.verificationStatus : 'PENDING',
        rating: profile ? profile.rating : 5.0,
      },
      monthlySales,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFarmers,
  getFarmerById,
  updateFarmerProfile,
  getFarmerDashboard,
};

