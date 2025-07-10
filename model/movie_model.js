const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const MovieLanguage = require('./movie_language_model');
const Genre = require('./genre_model');
const MovieCategory = require('./movie_category_model');
const VideoAdsModel = require('./video_ads_model');

const MovieModel = sequelize.define('MovieModel', {
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
    report_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    video_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    movie_video: {
        type: DataTypes.STRING,
        allowNull: true,
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
    is_highlighted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    is_watchlist: {
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
    tableName: 'movies',
    timestamps: true,
});

MovieModel.belongsTo(MovieLanguage, {
    foreignKey: 'movie_language',
    as: 'language',
});

MovieModel.belongsTo(Genre, {
    foreignKey: 'genre_id',
    as: 'genre',
});

MovieModel.belongsTo(MovieCategory, {
    foreignKey: 'movie_category',
    as: 'category',
});

module.exports = MovieModel;
