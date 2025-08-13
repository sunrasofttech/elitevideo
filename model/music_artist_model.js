const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const MusicArtist = sequelize.define('MusicArtist', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    artist_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_img:{
         type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'music_artist',
        timestamps: true,
    });


module.exports = MusicArtist;