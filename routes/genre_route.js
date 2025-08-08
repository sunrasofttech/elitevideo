const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadToSpace');
const genreController = require('../controller/genre_controller');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/', upload.single('cover_img'),adminAuthenticate, genreController.createGenre);
router.put('/:id', upload.single('cover_img'),adminAuthenticate, genreController.updateGenre);
router.post('/admin/get-all',adminAuthenticate, genreController.getAllGenres);

router.post('/get-all',Authenticate, genreController.getAllGenres);
router.delete('/:id',adminAuthenticate, genreController.deleteGenre);

module.exports = router;
