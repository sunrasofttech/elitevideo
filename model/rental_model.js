const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MovieModel = require('./movie_model');
const SeriesModel = require('./series_model');
const UserModel = require('./user_model');

const RentalModel = sequelize.define('RentalModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    movie_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: MovieModel,
            key: 'id',
        },
        onDelete: 'CASCADE',
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
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: UserModel,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    cost: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rented_on: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    validity_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'rental',
    timestamps: true,
});


RentalModel.belongsTo(MovieModel, {
    foreignKey: 'movie_id',
    as: 'movie',
});

RentalModel.belongsTo(SeriesModel, {
    foreignKey: 'series_id',
    as: 'series',
});

RentalModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
});

module.exports = RentalModel;
