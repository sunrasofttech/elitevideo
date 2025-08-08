const express = require('express');
const router = express.Router();
const  controller = require('../controller/dashboard_controller');
const Authenticate = require('../middleware/jwt_middleware');

router.post('/dashboard',Authenticate, controller.getDashboardStats);
router.post('/user-analytics',Authenticate, controller.getUserAnalyticsByYear);
router.post('/monthly-revenue',Authenticate,controller.getMonthlyRevenue);

module.exports = router;
