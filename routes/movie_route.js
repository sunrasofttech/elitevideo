const express = require('express');
const router = express.Router();
const movieController = require('../controller/movie_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

const movieUploads = upload.fields([
  { name: 'cover_img', maxCount: 1 },
  { name: 'poster_img', maxCount: 1 },
  { name: 'movie_video', maxCount: 1 },
  { name: 'trailor_video', maxCount: 1 }
]);

router.post('/',movieUploads,adminAuthenticate, movieController.addMovie);
router.put('/:id',movieUploads,adminAuthenticate, movieController.updateMovie);
router.post('/get-all',Authenticate, movieController.getAllMovies);
router.post('/:id',Authenticate, movieController.getMovieById);
router.post('/admin/get-all',adminAuthenticate, movieController.getAllMovies);
router.post('/admin/:id',adminAuthenticate, movieController.getMovieById);
router.delete('/',adminAuthenticate, movieController.deleteMovie);
router.post('/highlighted',Authenticate, movieController.getHighlightedMovies);
router.post('/watchlist',Authenticate, movieController.getWatchlistMovies);

router.post('/most-viewed',Authenticate, movieController.getMostViewedMovies);

module.exports = router;
