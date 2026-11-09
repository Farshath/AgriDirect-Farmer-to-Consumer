const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'agri_marketplace_super_secret_jwt_key_2026_farm_to_table_secure',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

const generateOrderNumber = () => {
  const prefix = 'AGRI';
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${random}`;
};

module.exports = { generateToken, generateOrderNumber };

