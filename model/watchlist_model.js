const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const UserModel = require('./user_model');
const MovieModel = require('./movie_model');
const ShortfilmModel = require('./short_film_model');
const SeasonEpisodeModel = require('./season_episode_model');

const WatchlistModel = sequelize.define('WatchlistModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: UserModel,
            key: 'id',
        },
        onDelete: 'CASCADE'
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
    type: {
        type: DataTypes.ENUM('movie', 'shortfilm','season_episode'),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'watchlist',
        timestamps: true,
    });


WatchlistModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
});

WatchlistModel.belongsTo(MovieModel, {
    foreignKey: 'movie_id',
    as: 'movie',
});

WatchlistModel.belongsTo(ShortfilmModel, {
    foreignKey: 'shortfilm_id',
    as: 'shortfilm'
});

WatchlistModel.belongsTo(SeasonEpisodeModel, {
    foreignKey: 'season_episode_id',
    as: 'season_episode'
});

module.exports = WatchlistModel;