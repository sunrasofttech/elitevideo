const express = require('express');
const router = express.Router();
const watchlistController = require('../controller/watchlist_controller');

router.post('/watchlist', watchlistController.addToWatchlist);

router.get('/watchlist/:userId', watchlistController.getUserWatchlist);

router.delete('/watchlist/remove/:userId/:type/:id', watchlistController.removeFromWatchlist);

module.exports = router;
