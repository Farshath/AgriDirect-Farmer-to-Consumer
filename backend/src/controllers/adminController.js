const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Dispute = require('../models/Dispute');
const Notification = require('../models/Notification');

// @desc    Get complete administrative dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (ADMIN)
const getAdminDashboard = async (req, res, next) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'FARMER' });
    const verifiedFarmers = await FarmerProfile.countDocuments({ verificationStatus: 'APPROVED' });
    const pendingFarmers = await FarmerProfile.countDocuments({ verificationStatus: 'PENDING' });
    const rejectedFarmers = await FarmerProfile.countDocuments({ verificationStatus: 'REJECTED' });

    const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });

    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['Pending', 'Confirmed', 'Processing', 'Ready for Delivery', 'Shipped'] },
    });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

    // Calculate total gross merchandise value (GMV)
    const deliveredOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalSales = deliveredOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    // Monthly analytics for Recharts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyDataMap = {};
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyDataMap[key] = { month: key, revenue: 0, orders: 0, customers: 0 };
    }

    const allOrders = await Order.find();
    allOrders.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (monthlyDataMap[key]) {
        monthlyDataMap[key].orders += 1;
        if (order.orderStatus !== 'Cancelled') {
          monthlyDataMap[key].revenue += order.totalAmount;
        }
      }
    });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent pending farmer verifications
    const pendingApplications = await FarmerProfile.find({ verificationStatus: 'PENDING' })
      .populate('user', 'name email phone avatar createdAt')
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalFarmers,
        verifiedFarmers,
        pendingFarmers,
        rejectedFarmers,
        totalCustomers,
        totalProducts,
        activeProducts,
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalSales,
        fulfilmentRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 100,
      },
      monthlyAnalytics: Object.values(monthlyDataMap),
      recentOrders,
      pendingApplications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all farmers for administration with filters
// @route   GET /api/admin/farmers
// @access  Private (ADMIN)
const getAdminFarmers = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.verificationStatus = status;
    }

    if (search) {
      query.$or = [
        { farmName: new RegExp(search, 'i') },
        { farmLocation: new RegExp(search, 'i') },
        { district: new RegExp(search, 'i') },
        { state: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await FarmerProfile.countDocuments(query);
    const farmers = await FarmerProfile.find(query)
      .populate('user', 'name email phone avatar isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

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

// @desc    Approve a farmer verification application
// @route   PUT /api/admin/farmers/:id/approve
// @access  Private (ADMIN)
const approveFarmer = async (req, res, next) => {
  try {
    const profile = await FarmerProfile.findById(req.params.id).populate('user');
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found' });
    }

    profile.verificationStatus = 'APPROVED';
    profile.rejectionReason = '';
    await profile.save();

    // Send notification to farmer
    await Notification.create({
      recipient: profile.user._id,
      title: 'Congratulations! Your Farm Profile is Verified',
      message: 'Your farmer application has been approved by AgriDirect administration. You can now publish fresh products to the marketplace!',
      type: 'VERIFICATION',
      link: '/farmer/products',
    });

    return res.status(200).json({
      success: true,
      message: `Farmer "${profile.farmName}" has been approved!`,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a farmer application with feedback reason
// @route   PUT /api/admin/farmers/:id/reject
// @access  Private (ADMIN)
const rejectFarmer = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const profile = await FarmerProfile.findById(req.params.id).populate('user');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Farmer profile not found' });
    }

    profile.verificationStatus = 'REJECTED';
    profile.rejectionReason = rejectionReason || 'Information or documents provided do not satisfy verification standards.';
    await profile.save();

    // Notify farmer
    await Notification.create({
      recipient: profile.user._id,
      title: 'Farm Verification Update',
      message: `Your verification request was not approved. Reason: ${profile.rejectionReason}. Please update your profile and documents.`,
      type: 'VERIFICATION',
      link: '/farmer/profile',
    });

    return res.status(200).json({
      success: true,
      message: `Farmer "${profile.farmName}" marked as rejected.`,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private (ADMIN)
const getAdminCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'CUSTOMER' };

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Enrich with order count
    const enriched = await Promise.all(
      customers.map(async (c) => {
        const orderCount = await Order.countDocuments({ customer: c._id });
        const cObj = c.toObject();
        cObj.orderCount = orderCount;
        return cObj;
      })
    );

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      customers: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across platform
// @route   GET /api/admin/orders
// @access  Private (ADMIN)
const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: new RegExp(search, 'i') },
        { 'deliveryAddress.fullName': new RegExp(search, 'i') },
        { 'deliveryAddress.city': new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.farmer', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed platform analytics
// @route   GET /api/admin/analytics
// @access  Private (ADMIN)
const getAdminAnalytics = async (req, res, next) => {
  try {
    // 1. Category product distribution
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $project: {
          name: '$categoryInfo.name',
          count: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
        },
      },
    ]);

    // 2. Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 6 },
    ]);

    const deliveredOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = deliveredOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return res.status(200).json({
      success: true,
      categoryStats,
      topProducts,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manage customer / farmer account status (activate / deactivate)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (ADMIN)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      user: { id: user._id, name: user.name, isActive: user.isActive },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAdminFarmers,
  approveFarmer,
  rejectFarmer,
  getAdminCustomers,
  getAdminOrders,
  getAdminAnalytics,
  toggleUserStatus,
};

