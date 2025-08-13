const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const UserModel = require('./user_model');
const MusicModel = require('./music_model');

const ChoosenForUMusic = sequelize.define('ChoosenForUMusic', {
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
        onDelete: 'CASCADE',
    },
    music_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: MusicModel,
            key: 'id',
        },
        onDelete: 'CASCADE',

    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'choosen_for_u_music',
        timestamps: true,
    });

ChoosenForUMusic.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });
ChoosenForUMusic.belongsTo(MusicModel, { foreignKey: 'music_id', as: 'music' });

module.exports = ChoosenForUMusic;