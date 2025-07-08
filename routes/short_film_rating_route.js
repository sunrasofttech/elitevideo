const express = require('express');
const router = express.Router();
const ShortFilmRatingController = require('../controller/short_film_rating_controller');

router.post('/rate', ShortFilmRatingController.addShortFilmRating);

router.post('/:short_film_id/ratings', ShortFilmRatingController.getShortFilmRating);

module.exports = router;
