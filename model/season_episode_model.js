const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SeriesModel = require('./series_model');
const SeasonModel = require('./season_model');

const SeasonEpisodeModel = sequelize.define('SeasonEpisodeModel', {
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
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    series_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: SeriesModel,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    season_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: SeasonModel,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    episode_name:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    episode_no:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    video_link:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    series_video:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    released_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'season',
    timestamps: true,
});

SeasonEpisodeModel.belongsTo(SeriesModel, {
    foreignKey: 'series_id',
    as: 'series',
});

module.exports = SeasonEpisodeModel;
