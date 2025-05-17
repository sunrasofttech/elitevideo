const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const MovieModel = require('./movie_model');
const ShortfilmModel = require('./short_film_model');
const SeasonEpisodeModel = require('./season_episode_model');
const LiveTvChannelModel = require('./live_tv_channel_model');

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
    movie_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: MovieModel,
            key: 'id',
        },
        onDelete: 'CASCADE'
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
    season_episode_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: SeasonEpisodeModel,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    channel_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: LiveTvChannelModel,
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    type: {
        type: DataTypes.ENUM('movie', 'shortfilm', 'season_episode'),
        allowNull: false,
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

VideoAdsModel.belongsTo(MovieModel, {
    foreignKey: 'movie_id',
    as: 'movie',
});

VideoAdsModel.belongsTo(ShortfilmModel, {
    foreignKey: 'shortfilm_id',
    as: 'shortfilm'
});

VideoAdsModel.belongsTo(SeasonEpisodeModel, {
    foreignKey: 'season_episode_id',
    as: 'season_episode'
});


VideoAdsModel.belongsTo(SeasonEpisodeModel, {
    foreignKey: 'channel_id',
    as: 'channel'
});

module.exports = VideoAdsModel;