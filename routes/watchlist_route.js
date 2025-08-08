const express = require('express');
const router = express.Router();
const watchlistController = require('../controller/watchlist_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/watchlist', watchlistController.addToWatchlist);

router.post('/watchlist/:userId', watchlistController.getUserWatchlist);

router.delete('/watchlist/remove/:userId/:type/:id', watchlistController.removeFromWatchlist);

module.exports = router;
