const express = require('express');
const router = express.Router();
const Authenticate = require('../middleware/jwt_middleware');

const continueWatchingController = require('../controller/continue_watching_controller');

router.post('/save',Authenticate, continueWatchingController.saveProgress);

router.post('/list',Authenticate, continueWatchingController.getContinueWatching);

module.exports = router;
