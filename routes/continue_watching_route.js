const express = require('express');
const router = express.Router();

const continueWatchingController = require('../controller/continue_watching_controller');

router.post('/save', continueWatchingController.saveProgress);

router.post('/list', continueWatchingController.getContinueWatching);

module.exports = router;
