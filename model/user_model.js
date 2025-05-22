const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const SubscriptionModel = require('../model/subscription_plan_model');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_first_time_user: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  deviceId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deviceToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mobile_no: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  app_version: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_paid_member: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  subscription_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: SubscriptionModel,
      key: 'id',
    },
  },
  is_subscription: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  subscription_end_date:{
    type:DataTypes.DATE,
    allowNull:true
  },
  is_block: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  active_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  jwt_api_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: 'user',
    timestamps: true,
  });

User.belongsTo(SubscriptionModel, { foreignKey: 'subscription_id', as: 'subscription' })

module.exports = User;