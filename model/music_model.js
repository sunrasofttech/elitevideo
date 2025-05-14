const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const MusicCategoryModel = require('./music_categories_model');
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
  category_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: MusicCategoryModel,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  song_title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  song_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  song_file: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  watched_count: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false
  },
  artist_name: {
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


  MusicModel.belongsTo(MusicCategoryModel, {
  foreignKey: 'category_id',
  as: 'category',
});


module.exports = MusicModel;