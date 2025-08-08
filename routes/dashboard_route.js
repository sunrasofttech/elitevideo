const express = require('express');
const router = express.Router();
const  controller = require('../controller/dashboard_controller');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

router.post('/dashboard',adminAuthenticate, controller.getDashboardStats);
router.post('/user-analytics',adminAuthenticate, controller.getUserAnalyticsByYear);
router.post('/monthly-revenue',adminAuthenticate,controller.getMonthlyRevenue);

module.exports = router;
