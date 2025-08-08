const User = require('../model/user_model');
const MovieModel = require('../model/movie_model');
const MusicModel = require('../model/music_model');
const { Op } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');
const PaymentHistory = require('../model/payment_history_model');;

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
      const updatedAt = moment(user.updatedAt);
      return {
        title: `${user.name || 'Someone'} became a subscriber ${updatedAt.fromNow()}`,
        date: updatedAt.format('DD-MM-YYYY'),
        time: updatedAt.format('HH:mm'),
      };
    });

    return res.status(200).json({
      status: true,
      message: "get all data successfully.",
      data: {
        totalUsers,
        activeUsers,
        subscriberActiveUsers,
        totalMovies,
        totalSongs,
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
};


exports.getUserAnalyticsByYear = async (req, res) => {
  try {
    const year = req.query.year || 2025;

    // Get actual data from DB
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

    // Default 12 months
    const allMonths = [
      { month_number: 1, month: "January" },
      { month_number: 2, month: "February" },
      { month_number: 3, month: "March" },
      { month_number: 4, month: "April" },
      { month_number: 5, month: "May" },
      { month_number: 6, month: "June" },
      { month_number: 7, month: "July" },
      { month_number: 8, month: "August" },
      { month_number: 9, month: "September" },
      { month_number: 10, month: "October" },
      { month_number: 11, month: "November" },
      { month_number: 12, month: "December" },
    ];

    // Merge logic: fill missing months with 0
    const finalData = allMonths.map((monthObj) => {
      const existing = results.find((r) => r.month_number === monthObj.month_number);
      return {
        month_number: monthObj.month_number,
        month: monthObj.month,
        user_count: existing ? Number(existing.user_count) : 0,
      };
    });

    res.status(200).json({
      status: true,
      year,
      data: finalData,
    });

  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

function getMonthsOfYear(year) {
    const months = [];
    for (let i = 1; i <= 12; i++) {
        const month = String(i).padStart(2, '0');
        months.push(`${year}-${month}`);
    }
    return months;
}

// Helper: Get month name from number
function getMonthName(monthNumber) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[parseInt(monthNumber, 10) - 1];
}

exports.getMonthlyRevenue = async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${parseInt(year) + 1}-01-01`);

        const dbRevenue = await PaymentHistory.findAll({
            where: {
                status: 'completed',
                createdAt: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate,
                }
            },
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
                [sequelize.fn('SUM', sequelize.cast(sequelize.col('amount'), 'DECIMAL')), 'total_revenue']
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
            raw: true
        });

        // Map database results by "YYYY-MM" => amount
        const revenueMap = {};
        dbRevenue.forEach(item => {
            revenueMap[item.month] = parseFloat(item.total_revenue);
        });

        const months = getMonthsOfYear(year);

        const finalRevenue = months.map(monthStr => {
            const [yr, mon] = monthStr.split('-');
            return {
                month: getMonthName(mon),
                year: yr,
                total_revenue: revenueMap[monthStr] || 0
            };
        });

        res.status(200).json({
            status: true,
            message: `Monthly revenue for year ${year} fetched successfully`,
            data: finalRevenue
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch revenue',
            data: err.message
        });
    }
};