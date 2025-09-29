const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const MovieLanguage = require('./movie_language_model');
const MovieCategory = require('./movie_category_model');

const TrailorModel = sequelize.define('TrailorModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    movie_name: {
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
    movie_category: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: MovieCategory,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    report_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    trailor_video_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    trailor_video: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quality: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    subtitle: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    movie_time: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    movie_rent_price: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_movie_on_rent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    rented_time_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    show_subscription: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    view_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    released_by: {
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
    tableName: 'trailors',
    timestamps: true,
});

TrailorModel.belongsTo(MovieLanguage, {
    foreignKey: 'movie_language',
    as: 'language',
});

TrailorModel.belongsTo(MovieCategory, {
    foreignKey: 'movie_category',
    as: 'category',
});

module.exports = TrailorModel;
