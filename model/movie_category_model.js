const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MovieCategory = sequelize.define('MovieCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
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
  img:{
    type:DataTypes.STRING,
    allowNull:true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: 'movie_category',
    timestamps: true,
  });

module.exports = MovieCategory;