const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const UserModel = require('./user_model');
const MovieModel = require('./movie_model');
const ShortfilmModel = require('./short_film_model');
const SeasonEpisodeModel = require('./season_episode_model');

const LikeModel = sequelize.define('LikeModel', {
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
    liked:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    disliked:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'like',
        timestamps: true,
    });


LikeModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
});

LikeModel.belongsTo(MovieModel, {
    foreignKey: 'movie_id',
    as: 'movie',
});

LikeModel.belongsTo(ShortfilmModel, {
    foreignKey: 'shortfilm_id',
    as: 'shortfilm'
});

LikeModel.belongsTo(SeasonEpisodeModel, {
    foreignKey: 'season_episode_id',
    as: 'season_episode'
});

module.exports = LikeModel;