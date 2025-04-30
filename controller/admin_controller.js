const Admin = require('../model/admin_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const API_SECRET = process.env.API_SECRET;

// Admin Signup
exports.signUp = async (req, reply) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return reply.status(400).send({status:false, message: 'Name and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, password: hashedPassword });

    reply.status(201).send({status:true, message: 'Admin registered successfully', admin });
  } catch (error) {
    reply.status(500).send({status:false, message: 'Server error', message: error.message });
  }
};

// Admin Login
exports.login = async (req, reply) => {
  try {
    const { name, password } = req.body;

    const admin = await Admin.findOne({ where: { name } });
    if (!admin) {
      return reply.status(404).send({status:false, message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return reply.status(401).send({status:false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, name: admin.name }, API_SECRET, { expiresIn: '1h' });

    reply.send({status:true, message: 'Login successful', token });
  } catch (error) {
    reply.status(500).send({status:false, message: 'Server error', message: error.message });
  }
};

// Edit Admin
exports.editAdmin = async (req, reply) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return reply.status(404).send({status:false, message: 'Admin not found' });
    }

    if (name) admin.name = name;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();
    reply.send({status:true, message: 'Admin updated successfully', admin });
  } catch (error) {
    reply.status(500).send({ status:false, message: 'Server error', message: error.message });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, reply) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return reply.status(404).send({status:false, message: 'Admin not found' });
    }

    await admin.destroy();
    reply.send({status:true, message: 'Admin deleted successfully' });
  } catch (error) {
    reply.status(500).send({status:false, message: 'Server error', message: error.message });
  }
};

exports.getAdminById = async (req, reply) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByPk(id, {
      attributes: ['id', 'name', 'createdAt'],
    });

    if (!admin) {
      return reply.status(404).send({ status: false, message: 'Admin not found' });
    }

    reply.send({ status: true, message: 'Admin found', admin });
  } catch (error) {
    reply.status(500).send({ status: false, message: 'Server error', message: error.message });
  }
};

exports.changePassword = async (req, reply) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return reply.status(400).send({ status: false, message: 'Old and new passwords are required' });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return reply.status(404).send({ status: false, message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return reply.status(401).send({ status: false, message: 'Old password is incorrect' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    reply.send({ status: true, message: 'Password updated successfully' });
  } catch (error) {
    reply.status(500).send({ status: false, message: 'Server error', message: error.message });
  }
};
