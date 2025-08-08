const jwt = require('jsonwebtoken');
const UserDevice = require('../model/user_device_model');
require('dotenv').config();
const SECRET_KEY = process.env.API_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ status: false, message: 'Unauthorized' });

    const decoded = jwt.verify(token, SECRET_KEY);

    const existing = await UserDevice.findOne({
      where: {
        user_id: decoded.id,
        jwt_token: token
      }
    });

    if (!existing) {
      return res.status(401).json({
        status: false,
        message: 'Session expired. Please login again.'
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authenticate;
