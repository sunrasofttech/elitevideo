const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Series = require('./series_model');

const SeriesCastCrewModel = sequelize.define('SeriesCastCrewModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    profile_img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    series_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            key: 'id',
            model: Series,
        },
        onDelete: 'CASCADE',
    },
    show_type: {
        type: DataTypes.ENUM('series', 'tvshows'),
        allowNull: false,
        defaultValue: 'series'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'series_cast_crew',
        timestamps: true,
    });

SeriesCastCrewModel.belongsTo(Series, {
    foreignKey: 'series_id',
    as: 'series',
});

module.exports = SeriesCastCrewModel;