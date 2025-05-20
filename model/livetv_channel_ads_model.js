const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const LiveTvChannelModel = require('./live_tv_channel_model');
const VideoAdsModel = require('./video_ads_model');

const LiveTvChannelAdsModel = sequelize.define('LiveTvChannelAdsModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  livetv_channel_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: LiveTvChannelModel,
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
    tableName: 'livetv_channel_ads',
    timestamps: true,
  });

  LiveTvChannelAdsModel.belongsTo(LiveTvChannelModel,{foreignKey:'livetv_channel_id',as:'livetv_channel'})
  LiveTvChannelAdsModel.belongsTo(VideoAdsModel,{foreignKey:'video_ad_id',as:'video_ad'})

module.exports = LiveTvChannelAdsModel;