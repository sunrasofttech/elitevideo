const express = require('express');
const router = express.Router();
const seriesRatingController = require('../controller/series_rating_controller');

router.post('/rate', seriesRatingController.addRating);

router.post('/average/:series_id', seriesRatingController.getSeriesRating);

module.exports = router;