const express = require('express');
const router = express.Router();
const ShortFilmRatingController = require('../controller/short_film_rating_controller');
const Authenticate = require('../middleware/jwt_middleware');

router.post('/rate',Authenticate, ShortFilmRatingController.addShortFilmRating);

router.post('/:short_film_id/ratings',Authenticate, ShortFilmRatingController.getShortFilmRating);

module.exports = router;
