const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const MovieModel = require('./movie_model');
const VideoAdsModel = require('./video_ads_model');

const MovieAdsModel = sequelize.define('MovieAdsModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  movie_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: MovieModel,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    video_ad_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: VideoAdsModel,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: 'movie_ads',
    timestamps: true,
  });

  MovieAdsModel.belongsTo(MovieModel,{foreignKey:'movie_id',as:'movie'})
  MovieAdsModel.belongsTo(VideoAdsModel,{foreignKey:'video_ad_id',as:'video_ad'})

module.exports = MovieAdsModel;