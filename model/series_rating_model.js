const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const SeriesModel = require('./series_model');

const SeriesRating = sequelize.define('SeriesRating', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  series_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: SeriesModel,
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

SeriesModel.hasMany(SeriesRating, { foreignKey: 'series_id', as: 'ratings' });
SeriesRating.belongsTo(SeriesModel, { foreignKey: 'series_id' });

module.exports = SeriesRating;
