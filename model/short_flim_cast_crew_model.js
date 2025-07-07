const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const ShortFilmModel = require('./short_film_model');

const ShortFilmCastCrewModel = sequelize.define('ShortFilmCastCrewModel', {
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
    shortfilm_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            key: 'id',
            model: ShortFilmModel,
        },
        onDelete: 'CASCADE',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'shortfilm_castcrew',
        timestamps: true,
    });

ShortFilmCastCrewModel.belongsTo(ShortFilmModel, {
    foreignKey: 'shortfilm_id',
    as: 'shortfilm',
});

module.exports = ShortFilmCastCrewModel;