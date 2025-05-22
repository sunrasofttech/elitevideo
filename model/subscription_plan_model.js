const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SubscriptionPlanModel = sequelize.define('SubscriptionPlanModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    plan_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    all_content: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    watchon_tv_laptop: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    addfree_movie_shows: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    number_of_device_that_logged: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    max_video_quality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    time_duration: {
        type: DataTypes.ENUM('month', 'week', 'year'),
        defaultValue: 'month',
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'subscription_plan',
        timestamps: true,
    });

module.exports = SubscriptionPlanModel;