const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LiveTvCategory = sequelize.define('LiveTvCategory', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: 'live_category',
    timestamps: true,
  });

module.exports = LiveTvCategory;