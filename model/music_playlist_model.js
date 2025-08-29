const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const UserModel = require('./user_model'); 
const MusicModel = require('./music_model');

const PlaylistModel = sequelize.define('PlaylistModel', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'playlists',
  timestamps: true,
});

const PlaylistSong = sequelize.define('PlaylistSong', {
  playlist_id: {
    type: DataTypes.UUID,
    references: {
      model: PlaylistModel,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  song_id: {
    type: DataTypes.UUID,
    references: {
      model: MusicModel,
      key: 'id',
    },
    onDelete: 'CASCADE',
  }
}, {
  tableName: 'playlist_songs',
  timestamps: false,
});

// Associations
PlaylistModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });
PlaylistModel.belongsToMany(MusicModel, { through: PlaylistSong, foreignKey: 'playlist_id', as: 'songs' });
MusicModel.belongsToMany(PlaylistModel, { through: PlaylistSong, foreignKey: 'song_id', as: 'playlists' });

module.exports = { PlaylistModel, PlaylistSong };
