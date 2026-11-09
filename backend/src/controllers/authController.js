const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const { generateToken } = require('../utils/helpers');

// @desc    Register a new user (Customer or Farmer)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      // Farmer-specific fields (optional on registration, can be updated later)
      farmName,
      farmLocation,
      district,
      state,
      farmingMethod,
      cropTypes,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const requestedRole = role && ['FARMER', 'CUSTOMER'].includes(role.toUpperCase())
      ? role.toUpperCase()
      : 'CUSTOMER';

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: requestedRole,
      phone: phone || '',
    });

    let farmerProfile = null;
    if (requestedRole === 'FARMER') {
      farmerProfile = await FarmerProfile.create({
        user: user._id,
        farmName: farmName || `${name}'s Farm`,
        farmLocation: farmLocation || 'Rural Agri Region',
        district: district || 'Nashik',
        state: state || 'Maharashtra',
        farmingMethod: farmingMethod || 'Organic Certified',
        cropTypes: Array.isArray(cropTypes) && cropTypes.length > 0 ? cropTypes : ['Vegetables', 'Fruits'],
        verificationStatus: 'PENDING',
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: `${requestedRole === 'FARMER' ? 'Farmer application registered. Pending admin verification.' : 'Customer registration successful!'}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      farmerProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    let farmerProfile = null;
    if (user.role === 'FARMER') {
      farmerProfile = await FarmerProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      farmerProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user info
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let farmerProfile = null;

    if (user.role === 'FARMER') {
      farmerProfile = await FarmerProfile.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      farmerProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update basic user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout (Client cleans token, server acknowledges)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Signed out successfully',
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
};

