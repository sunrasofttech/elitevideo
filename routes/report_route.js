const express = require('express');
const router = express.Router();
const ReportController = require('../controller/report_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/add',Authenticate, ReportController.reportContent);
router.post('/get',Authenticate,ReportController.getAllReports);

module.exports = router;