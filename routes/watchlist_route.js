const express = require('express');
const router = express.Router();
const watchlistController = require('../controller/watchlist_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/watchlist',Authenticate, watchlistController.addToWatchlist);

router.post('/watchlist/:userId',Authenticate, watchlistController.getUserWatchlist);

router.delete('/watchlist/remove/:userId/:type/:id',Authenticate, watchlistController.removeFromWatchlist);

module.exports = router;
