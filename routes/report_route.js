const express = require('express');
const router = express.Router();
const ReportController = require('../controller/report_controller');

router.post('/add', ReportController.reportContent);
router.post('/get',ReportController.getAllReports);

module.exports = router;