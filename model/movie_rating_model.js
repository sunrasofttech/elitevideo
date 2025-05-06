const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const MovieModel = require('./movie_model');

const MovieRating = sequelize.define('MovieRating', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  movie_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: MovieModel,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'movie_ratings',
  timestamps: true,
});

MovieModel.hasMany(MovieRating, { foreignKey: 'movie_id', as: 'ratings' });
MovieRating.belongsTo(MovieModel, { foreignKey: 'movie_id' });

module.exports = MovieRating;
