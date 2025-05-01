const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AdminSetting = sequelize.define('AdminSetting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  current_version: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  admin_upi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  admin_contact_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  apk: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  razorpay_key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phonepay_key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phonepay_pay_salt_key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cashfree_client_secret_key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cashfree_client_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  secret_key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  terms_and_condition: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  privacy_policy: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  payment_type: {
    type: DataTypes.ENUM('UPI', 'RazorPay', 'Cashfree', 'PhonePe', 'SkillPay', 'NoGateway','Free'),
    allowNull: true,
    defaultValue: 'UPI',
  },
  about_us: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  playStore_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  whatsapp_contact_number :{
    type: DataTypes.STRING,
    allowNull: true,
  },
  author_name:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  developed_by:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  app_logo:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  admin_email:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'admin_setting',
  timestamps: false,
});

module.exports = AdminSetting;
