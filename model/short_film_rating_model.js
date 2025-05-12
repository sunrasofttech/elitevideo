const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const ShortFilmModel = require('./short_film_model');

const ShortFilmRatingModel = sequelize.define('ShortFilmRatingModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  short_film_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ShortFilmModel,
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
  tableName: 'short_film_ratings',
  timestamps: true,
});

ShortFilmModel.hasMany(ShortFilmRatingModel, { foreignKey: 'short_film_id', as: 'ratings' });
ShortFilmRatingModel.belongsTo(ShortFilmModel, { foreignKey: 'short_film_id' });

module.exports = ShortFilmRatingModel;
