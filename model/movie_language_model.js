const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MovieLanguage = sequelize.define('MovieLanguage', {
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: 'movie_language',
    timestamps: true,
  });

module.exports = MovieLanguage;