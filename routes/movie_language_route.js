const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');

const {
  createMovieLanguage,
  updateMovieLanguage,
  getAllMovieLanguages,
  deleteMovieLanguage,
} = require('../controller/movie_language_controller');

router.post('/', upload.single('cover_img'), createMovieLanguage);
router.put('/:id', upload.single('cover_img'), updateMovieLanguage);
router.post('/get-all', getAllMovieLanguages);
router.delete('/:id', deleteMovieLanguage);

module.exports = router;
