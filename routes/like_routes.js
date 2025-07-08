const express = require('express');
const router = express.Router();
const LikeController = require('../controller/like_controller');

router.post('/', LikeController.addLike);

router.post('/:userId', LikeController.getUserLikes);


module.exports = router;
