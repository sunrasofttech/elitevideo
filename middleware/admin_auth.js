// middleware/admin_auth.js
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin_model');
require('dotenv').config();

const API_SECRET = process.env.API_SECRET;

const adminAuthenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: false, message: 'Unauthorized - Token missing' });
    }

    const decoded = jwt.verify(token, API_SECRET);

    const admin = await Admin.findOne({
      where: {
        id: decoded.id,
        jwt_api_token: token
      }
    });

    if (!admin) {
      return res.status(401).json({ status: false, message: 'Invalid or expired token' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: 'Authentication failed',
      error: err.message
    });
  }
};

module.exports = adminAuthenticate;
