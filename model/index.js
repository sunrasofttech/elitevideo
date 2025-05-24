const { sequelize } = require('../config/db');

// 👇 Import all your models here:
require('./admin_model');
require('./genre_model');
require('./movie_model');
// ...add all your models

module.exports = sequelize;
