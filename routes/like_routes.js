const express = require('express');
const router = express.Router();
const LikeController = require('../controller/like_controller');
const Authenticate = require('../middleware/jwt_middleware');

router.post('/',Authenticate, LikeController.addLike);

router.post('/getlike',Authenticate, LikeController.getUserLikes);


module.exports = router;
