const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MusicCategoryModel = sequelize.define('MusicCategoryModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name:{
    type:DataTypes.STRING,
    allowNull:true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: 'music_category',
    timestamps: true,
  });

module.exports = MusicCategoryModel;