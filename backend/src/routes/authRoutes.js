const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Primary and explicit customer / farmer registration endpoints
router.post('/register', register);
router.post('/register/customer', (req, res, next) => {
  req.body.role = 'CUSTOMER';
  return register(req, res, next);
});
router.post('/register/farmer', (req, res, next) => {
  req.body.role = 'FARMER';
  return register(req, res, next);
});

// Informative handler for accidental GET /register requests (e.g. browser inspection)
router.get('/register', (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Registration endpoint requires HTTP POST with JSON body (name, email, password, and role).',
    endpoints: {
      unified: 'POST /api/auth/register',
      customer: 'POST /api/auth/register/customer',
      farmer: 'POST /api/auth/register/farmer',
    },
  });
});
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;

