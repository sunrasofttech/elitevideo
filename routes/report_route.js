const express = require('express');
const router = express.Router();
const ReportController = require('../controller/report_controller');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/add',Authenticate, ReportController.reportContent);
router.post('/get',adminAuthenticate,ReportController.getAllReports);

module.exports = router;