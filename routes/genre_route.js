const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadToSpace');
const genreController = require('../controller/genre_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/', upload.single('cover_img'),Authenticate, genreController.createGenre);
router.put('/:id', upload.single('cover_img'),Authenticate, genreController.updateGenre);
router.post('/get-all',Authenticate, genreController.getAllGenres);
router.delete('/:id',Authenticate, genreController.deleteGenre);

module.exports = router;
