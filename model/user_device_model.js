const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user_model');

const UserDevice = sequelize.define('UserDevice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  jwt_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  login_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_devices',
  timestamps: false,
});

UserDevice.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = UserDevice;
