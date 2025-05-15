const User = require('../model/user_model');
const MovieModel = require('../model/movie_model');
const MusicModel = require('../model/music_model');
const { Op } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: true } });
    const subscriberActiveUsers = await User.count({
      where: {
        is_active: true,
        is_subscription: true,
      },
    });

    const totalMovies = await MovieModel.count();
    const totalSongs = await MusicModel.count();

    const recentSubscribers = await User.findAll({
      where: {
        is_subscription: true,
      },
      order: [['updatedAt', 'DESC']],
      limit: 5,
    });

    const recentActivity = recentSubscribers.map((user) => {
      const timeAgo = moment(user.updatedAt).fromNow();
      return `${user.name || 'Someone'} became a subscriber ${timeAgo}`;
    });

    return res.status(200).json({
      totalUsers,
      activeUsers,
      subscriberActiveUsers,
      totalMovies,
      totalSongs,
      recentActivity,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getUserAnalyticsByYear = async (req, res) => {
  try {
    const year = req.query.year || 2025;

    const [results] = await sequelize.query(`
      SELECT 
        MONTHNAME(createdAt) AS month,
        MONTH(createdAt) AS month_number,
        COUNT(*) AS user_count
      FROM user
      WHERE YEAR(createdAt) = :year
      GROUP BY month, month_number
      ORDER BY month_number
    `, {
      replacements: { year },
    });

    res.status(200).json({
      status: true,
      year,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};
