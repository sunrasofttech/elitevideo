const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  password :{
    type: DataTypes.STRING,
    allowNull: true,
  },
  profile_img:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  email:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  role:{
    type:DataTypes.ENUM('admin','subadmin'),
    defaultValue:'subadmin',
    allowNull:false,
  },
   permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
{
  tableName: 'admin',
  timestamps: false,
});

module.exports = Admin;