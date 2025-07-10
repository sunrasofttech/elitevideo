const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MovieLanguage = require('./movie_language_model');
const Genre = require('./genre_model');
const MovieCategory = require('./movie_category_model');

const SeriesModel = sequelize.define('SeriesModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    series_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    cover_img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    poster_img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    movie_language: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: MovieLanguage,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    genre_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Genre,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    movie_category: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: MovieCategory,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    series_rent_price: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_series_on_rent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    rented_time_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    released_by: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    released_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    report_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'series',
    timestamps: true,
});

SeriesModel.belongsTo(MovieLanguage, {
    foreignKey: 'movie_language',
    as: 'language',
});


SeriesModel.belongsTo(Genre, {
    foreignKey: 'genre_id',
    as: 'genre',
});

SeriesModel.belongsTo(MovieCategory, {
    foreignKey: 'movie_category',
    as: 'category',
});

module.exports = SeriesModel;
