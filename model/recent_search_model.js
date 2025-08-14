const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const UserModel = require('./user_model');

const RecentSearchModel = sequelize.define('RecentSearchModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    type: {
        type: DataTypes.ENUM('movie', 'shortfilm', 'season_episode','series','season'),
        allowNull: false,
    },
    type_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'recent_search',
    timestamps: true,
});

RecentSearchModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

module.exports = RecentSearchModel;
