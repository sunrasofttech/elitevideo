const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const VideoAdsModel = sequelize.define('VideoAdsModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    ad_video: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ad_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    video_time: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    skip_time: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'videoads',
        timestamps: true,
    });

module.exports = VideoAdsModel;