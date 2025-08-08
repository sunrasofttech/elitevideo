const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');


const {
  createMovieLanguage,
  updateMovieLanguage,
  getAllMovieLanguages,
  deleteMovieLanguage,
} = require('../controller/movie_language_controller');

router.post('/', upload.single('cover_img'),Authenticate, createMovieLanguage);
router.put('/:id', upload.single('cover_img'),Authenticate, updateMovieLanguage);
router.post('/get-all',Authenticate,getAllMovieLanguages);
router.delete('/:id',Authenticate, deleteMovieLanguage);

module.exports = router;
