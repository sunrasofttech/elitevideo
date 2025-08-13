const express = require('express');
const router = express.Router();
const controller = require('../controller/ choosen_for_u_music_controller');
const Authenticate = require('../middleware/jwt_middleware');
// const adminAuthenticate = require('../middleware/admin_auth');

router.post('/',Authenticate, controller.createChoosenForUMusic);

router.get('/', controller.getChoosenForUMusic);

module.exports = router;

