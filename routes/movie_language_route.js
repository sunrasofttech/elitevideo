const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadToSpace');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


const {
  createMovieLanguage,
  updateMovieLanguage,
  getAllMovieLanguages,
  deleteMovieLanguage,
} = require('../controller/movie_language_controller');

router.post('/', upload.single('cover_img'),adminAuthenticate, createMovieLanguage);
router.put('/:id', upload.single('cover_img'),adminAuthenticate, updateMovieLanguage);
router.post('/get-all',getAllMovieLanguages);
router.delete('/:id',adminAuthenticate, deleteMovieLanguage);

module.exports = router;

// 