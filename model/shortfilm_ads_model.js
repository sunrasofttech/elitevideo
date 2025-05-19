const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const ShortfilmModel = require('./short_film_model');
const VideoAdsModel = require('./video_ads_model');

const ShortfilmAdsModel = sequelize.define('ShortfilmAdsModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  shortfilm_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: ShortfilmModel,
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
    tableName: 'shortfilm_ads',
    timestamps: true,
  });

  ShortfilmAdsModel.belongsTo(ShortfilmModel,{foreignKey:'shortfilm_id',as:'shortfilm'})
  ShortfilmAdsModel.belongsTo(VideoAdsModel,{foreignKey:'video_ad_id',as:'video_ad'})

module.exports = ShortfilmAdsModel;