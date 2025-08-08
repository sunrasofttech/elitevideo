const express = require('express');
const router = express.Router();
const seriesRatingController = require('../controller/series_rating_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/rate',Authenticate, seriesRatingController.addRating);

router.post('/average/:series_id',Authenticate, seriesRatingController.getSeriesRating);

module.exports = router;