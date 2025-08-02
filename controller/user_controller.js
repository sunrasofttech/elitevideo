const User = require('../model/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SubscriptionModel = require('../model/subscription_plan_model');
const UserDevice = require('../model/user_device_model');
require('dotenv').config();
const SECRET_KEY = process.env.API_SECRET;
const { Op } = require('sequelize');
const moment = require('moment');

require('dotenv').config();

exports.clearExpiredSubscriptions = async () => {
  try {
    const today = new Date();

    await UserModel.update(
      {
        subscription_id: null,
        subscription: false,
      },
      {
        where: {
          subscription_end_date: {
            [Op.lt]: today,
          },
        },
      }
    );

    console.log('Expired subscriptions cleared');
  } catch (err) {
    console.error('Error in cron:', err);
  }
};

exports.deactivateInactiveUsers = async () => {
  try {
    const today = moment().format('YYYY-MM-DD');

    const users = await UserModel.findAll({
      where: {
        is_active: true,
        [Op.or]: [
          { active_date: { [Op.ne]: today } },
          { active_date: { [Op.is]: null } },
        ],
      },
    });

    const userIds = users.map(user => user.id);

    if (userIds.length > 0) {
      await UserModel.update(
        { is_active: false },
        {
          where: {
            id: { [Op.in]: userIds },
          },
        }
      );

      console.log(` Deactivated ${userIds.length} inactive users.`);
    } else {
      console.log(' All users are already active for today.');
    }
  } catch (error) {
    console.error(' Error in deactivating inactive users:', error.message);
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, mobile_no, email, password, deviceToken, deviceId, app_version, model, brand, device, manufacturer, android_version, SDK, board, fingerprint, hardware, android_ID, Product
    } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ status: false, message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      mobile_no,
      email,
      password: hashedPassword,
      deviceToken,
      deviceId,
      app_version,
      model,
      brand,
      device,
      manufacturer,
      android_version,
      SDK,
      board,
      fingerprint,
      hardware,
      android_ID,
      Product

    });

    res.status(201).json({ status: true, message: "new user created successfully.", newUser });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
exports.signin = async (req, res) => {
  try {
    const {
      email,
      password,
      deviceId,
      deviceToken,
      model,
      brand,
      device,
      manufacturer,
      android_version,
      SDK,
      board,
      fingerprint,
      hardware,
      android_ID,
      Product,
    } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: SubscriptionModel, as: 'subscription' }]
    });

    if (!user)
      return res.status(404).json({ status: false, message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ status: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);

    // Get all devices for this user
    const currentDevices = await UserDevice.findAll({
      where: { user_id: user.id },
      order: [['login_time', 'ASC']],
      attributes: ['device_id', 'model', 'login_time'],
    });

    const currentDeviceCount = currentDevices.length;

    let allowedDeviceCount = 1; 
    if (user.is_subscription && user.subscription) {
      allowedDeviceCount = user.subscription.number_of_device_that_logged || 1;
    }

    const isDeviceAlreadyLoggedIn = currentDevices.some(
      (d) => d.device_id === deviceId
    );

    if (currentDeviceCount >= allowedDeviceCount && !isDeviceAlreadyLoggedIn) {
      return res.status(200).json({
        status: false,
        message: `You have reached the maximum allowed devices (${allowedDeviceCount}). Please logout from one to continue.`,
        active_devices: currentDevices,
         user_id: user.id,
      });
    }

    // ✅ Either device is already logged in or under limit — proceed to login
    const existingDevice = await UserDevice.findOne({
      where: {
        user_id: user.id,
        device_id: deviceId,
      },
    });

    if (!existingDevice) {
      await UserDevice.create({
        user_id: user.id,
        device_id: deviceId,
        jwt_token: token,
        model: model,
        login_time: new Date(),
      });
    } else {
      // Update token and login time
      existingDevice.jwt_token = token;
      existingDevice.login_time = new Date();
      await existingDevice.save();
    }

    // Update user device info
    user.deviceToken = deviceToken;
    user.jwt_api_token = token;
    user.deviceId = deviceId;
    user.model = model;
    user.brand = brand;
    user.device = device;
    user.manufacturer = manufacturer;
    user.android_version = android_version;
    user.SDK = SDK;
    user.board = board;
    user.fingerprint = fingerprint;
    user.hardware = hardware;
    user.android_ID = android_ID;
    user.Product = Product;

    await user.save();

    res.status(200).json({
      status: true,
      message: 'User signed in successfully',
      token,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, mobile_no } = req.query;

    const whereClause = {};
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (mobile_no) {
      whereClause.mobile_no = { [Op.like]: `%${mobile_no}%` };
    }

    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: SubscriptionModel,
          as: 'subscription',
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: true,
      message: 'Get all users successfully.',
      total: users.count,
      page: parseInt(page),
      pages: Math.ceil(users.count / limit),
      users: users.rows,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: SubscriptionModel,
        as: 'subscription'
      }]
    });
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });
    res.status(200).json({ status: true, message: "Get user successfully.", user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });

    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (req.file) {
      updates.profile_picture = req.file.location;
    }

    Object.keys(updates).forEach(key => {
      user[key] = updates[key];
    });

    await user.save();
    res.status(200).json({ status: true, message: "Updated user successfully.", user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });

    await user.destroy();
    res.status(200).json({ status: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Change Password API using user ID
exports.changePassword = async (req, res) => {

  try {
    const { id, oldPassword, newPassword } = req.body;

    if (!id || !oldPassword || !newPassword) {
      return res.status(400).json({ status: false, message: 'All fields are required' });
    }

    const user = await User.findByPk(id);
    console.log(`user :-   8888  ${user}`);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });


    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ status: false, message: 'Old password is incorrect' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ status: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Forget Password API
exports.forgotPassword = async (req, res) => {
  try {
    const { mobile_no, newPassword } = req.body;

    if (!mobile_no || !newPassword) {
      return res.status(400).json({ status: false, message: 'Mobile number and new password are required' });
    }

    const user = await User.findOne({ where: { mobile_no } });
    console.log(`user is ${user}`);

    if (!user) return res.status(404).json({ status: false, message: 'User not found with this mobile number' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ status: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.logoutDevice = async (req, res) => {
  try {
    const { user_id, device_id } = req.body;

    await UserDevice.destroy({
      where: {
        user_id,
        device_id
      }
    });

    res.status(200).json({ status: true, message: "Device logged out" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};