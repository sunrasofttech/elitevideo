const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MusicModel = sequelize.define('MusicModel', {
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
  song_title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  song_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  song_file:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  description:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  watched_count:{
    type: DataTypes.TEXT,
    allowNull: true,
  },
  artist_name:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: 'music',
    timestamps: true,
  });

module.exports = MusicModel;