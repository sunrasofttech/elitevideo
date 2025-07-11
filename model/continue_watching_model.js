const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ContinueWatching = sequelize.define('ContinueWatching', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: 'continue_watching',
    timestamps: true,
  });

module.exports = ContinueWatching;