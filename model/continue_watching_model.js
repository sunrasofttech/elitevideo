const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const UserModel = require('./user_model');

const ContinueWatching = sequelize.define('ContinueWatching', {
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
        type: DataTypes.ENUM('movie', 'shortfilm', 'season_episode'),
        allowNull: false,
    },
    type_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    current_time: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    is_watched: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'continue_watching',
    timestamps: true,
      indexes: [
        {
            unique: true,
            fields: ['user_id', 'type', 'type_id']
        }
    ]
});

ContinueWatching.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

module.exports = ContinueWatching;
