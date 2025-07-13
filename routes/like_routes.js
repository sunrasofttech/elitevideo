const express = require('express');
const router = express.Router();
const LikeController = require('../controller/like_controller');

router.post('/', LikeController.addLike);

router.post('/getlike', LikeController.getUserLikes);


module.exports = router;
