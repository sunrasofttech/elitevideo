const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const MovieModel = require('./movie_model');

const CastCrewModel = sequelize.define('CastCrewModel', {
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
    movie_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            key: 'id',
            model: MovieModel,
        },
        onDelete: 'CASCADE',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'cast_crew',
        timestamps: true,
    });

CastCrewModel.belongsTo(MovieModel, {
    foreignKey: 'movie_id',
    as: 'movie',
});

module.exports = CastCrewModel;