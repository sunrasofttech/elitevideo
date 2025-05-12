const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const LiveTvCategoryModel = require('../model/live_tv_category_model');

const LiveTvChannel = sequelize.define('LiveTvChannel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  cover_img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  poster_img:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  live_category_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
        model: LiveTvCategoryModel,
        key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  android_channel_url:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ios_channel_url:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false,
  },
  description:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: 'livetv_channel',
    timestamps: true,
  });

module.exports = LiveTvChannel;