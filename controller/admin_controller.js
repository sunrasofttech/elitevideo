const Admin = require('../model/admin_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const API_SECRET = process.env.API_SECRET;

exports.signUp = async (req, reply) => {
  try {
    const { name, password, role = 'subadmin', selectedPermissions = {}, email, profile_img } = req.body;

    if (!name || !password) {
      return reply.status(400).send({ status: false, message: 'Name and password are required' });
    }

    if (role === 'admin') {
      const existingAdmin = await Admin.findOne({ where: { role: 'admin' } });
      if (existingAdmin) {
        return reply.status(400).send({ status: false, message: 'Admin already created' });
      }
    }

    // Define all possible permissions
    const allPermissions = [
      'Dashboard', 'Movie', 'Music', 'Web Series', 'Tv Show', 'Live TV',
      'Short Film', 'Ads', 'Rentals', 'Language', 'Genre', 'Users',
      'Sub Admin', 'Subscription', 'Reports', 'Notification', 'Settings'
    ];

    // Create permissions object
    let permissions = {};
    allPermissions.forEach((key) => {
      if (role === 'admin') {
        permissions[key] = true;
      } else {
        permissions[key] = !!selectedPermissions[key];
      }
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      password: hashedPassword,
      role,
      email,
      profile_img,
      permissions,
    });

    reply.status(201).send({
      status: true,
      message: `${role} registered successfully`,
      data: admin
    });
  } catch (error) {
    reply.status(500).send({
      status: false,
      message: 'Server error',
      error: error.message
    });
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

exports.editAdmin = async (req, reply) => {
  try {
    const { id } = req.params;
    const { name, password, email, role, selectedPermissions = [] } = req.body;
    const profile_img = req.file ? req.file.path : undefined;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return reply.status(404).send({ status: false, message: 'Admin not found' });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (password) admin.password = await bcrypt.hash(password, 10);
    if (profile_img) admin.profile_img = profile_img;

    const allPermissions = [
      'Dashboard', 'Movie', 'Music', 'Web Series', 'Tv Show', 'Live TV',
      'Short Film', 'Ads', 'Rentals', 'Language', 'Genre', 'Users',
      'Sub Admin', 'Subscription', 'Reports', 'Notification', 'Settings'
    ];

    // Permissions logic
    if (role === 'admin') {
      // Grant all permissions for admin
      const permissions = {};
      allPermissions.forEach((key) => {
        permissions[key] = true;
      });
      admin.permissions = permissions;
    } else if (role === 'subadmin') {
      // Only update permissions if selectedPermissions is explicitly provided
      if (Array.isArray(selectedPermissions) && selectedPermissions.length > 0) {
        const permissions = {};
        allPermissions.forEach((key) => {
          permissions[key] = selectedPermissions.includes(key);
        });
        admin.permissions = permissions;
      }
      // else: keep existing permissions as is
    }

    await admin.save();
    return reply.send({ status: true, message: 'Admin updated successfully', admin });
  } catch (error) {
    return reply.status(500).send({ status: false, message: 'Server error', error: error.message });
  }
};

exports.getAllSubAdmins = async (req, reply) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereCondition = {
      role: 'subadmin',
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      })
    };

    const { count, rows } = await Admin.findAndCountAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    reply.send({
      status: true,
      message: 'Subadmins fetched successfully',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    reply.status(500).send({
      status: false,
      message: 'Server error',
      error: error.message
    });
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

    const admin = await Admin.findByPk(id);

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
