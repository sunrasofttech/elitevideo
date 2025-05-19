const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const SeasonEpisodeModel = require('./season_episode_model');
const VideoAdsModel = require('./video_ads_model');

const SeasonEpisodeAdsModel = sequelize.define('SeasonEpisodeAdsModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  season_episode_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: SeasonEpisodeModel,
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
    tableName: 'season_episode_ads',
    timestamps: true,
  });

  SeasonEpisodeAdsModel.belongsTo(SeasonEpisodeModel,{foreignKey:'season_episode_id',as:'season_episode'})
  SeasonEpisodeAdsModel.belongsTo(VideoAdsModel,{foreignKey:'video_ad_id',as:'video_ad'})

module.exports = SeasonEpisodeAdsModel;