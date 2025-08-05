const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SeriesModel = require('./series_model');

const SeasonModel = sequelize.define('SeasonModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    season_name: {
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
    show_type: {
        type: DataTypes.ENUM('series', 'tvshows'),
        allowNull: false,
        defaultValue: 'series'
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

SeasonModel.belongsTo(SeriesModel, {
    foreignKey: 'series_id',
    as: 'series',
});

module.exports = SeasonModel;
