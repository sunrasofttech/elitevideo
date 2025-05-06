const express = require('express');
const router = express.Router();
const movieController = require('../controller/movie_controller');
const upload = require('../utils/upload');

const movieUploads = upload.fields([
  { name: 'cover_img', maxCount: 1 },
  { name: 'poster_img', maxCount: 1 },
  { name: 'movie_video', maxCount: 1 },
  { name: 'trailor_video', maxCount: 1 }
]);

router.post('/',movieUploads, movieController.addMovie);
router.put('/:id',movieUploads, movieController.updateMovie);
router.post('/get-all', movieController.getAllMovies);
router.post('/:id', movieController.getMovieById);
router.delete('/:id', movieController.deleteMovie);
router.get('/highlighted', movieController.getHighlightedMovies);


module.exports = router;
