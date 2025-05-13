const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ReportModel = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'reports',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'content_id', 'content_type'],
    },
  ],
});

module.exports = ReportModel;
