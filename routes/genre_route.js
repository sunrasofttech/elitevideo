const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const genreController = require('../controller/genre_controller');
// const Authenticate = require('../middleware/jwt_middleware');

router.post('/', upload.single('cover_img'), genreController.createGenre);
router.put('/:id', upload.single('cover_img'), genreController.updateGenre);
router.post('/get-all', genreController.getAllGenres);
router.delete('/:id', genreController.deleteGenre);

module.exports = router;
