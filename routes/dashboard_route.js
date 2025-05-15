const express = require('express');
const router = express.Router();
const  controller = require('../controller/dashboard_controller');

router.post('/dashboard', controller.getDashboardStats);
router.get('/user-analytics', controller.getUserAnalyticsByYear);


module.exports = router;
