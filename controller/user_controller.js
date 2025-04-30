const User = require('../model/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.API_SECRET;

exports.signup = async (req, res) => {
  try {
    const { name, mobile_no, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({status:false, message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      mobile_no,
      email,
      password: hashedPassword,
    });

    res.status(201).json({status:true,message:"new user created successfully.",newUser});
  } catch (error) {
    res.status(500).json({status:false, message: error.message });
  }
};

// Signin
exports.signin = async (req, res) => {
  try {
    const { email, password, deviceToken } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({status:false, message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({status:false,message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);

    user.deviceToken = deviceToken;
    user.jwt_api_token = token;
    await user.save();

    res.status(200).json({status:true,message:"User sign in successfully",token });
  } catch (error) {
    res.status(500).json({status:false, message: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({status:true, message:"Get all user successfully.",users});
  } catch (error) {
    res.status(500).json({status:false, message: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({status:false,message: 'User not found' });
    res.status(200).json({status:false,message:"Get user successfully.",user});
  } catch (error) {
    res.status(500).json({status:false, message: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ status: false, message: 'User not found' });

    const updates = req.body;

    if (req.file) {
      updates.profile_picture = req.file.path;
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
    if (!user) return res.status(404).json({status:false, message: 'User not found' });

    await user.destroy();
    res.status(200).json({status:true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({status:false,message: error.message });
  }
};
