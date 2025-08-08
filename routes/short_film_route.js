const express = require('express');
const router = express.Router();
const controller = require('../controller/short_film_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');


// Upload multiple fields (name must match front-end form)
const fileUploads = upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'poster_img', maxCount: 1 },
    { name: 'short_video', maxCount: 1 },
]);

router.post('/create', fileUploads, controller.createShortFilm);
router.post('/get-all', controller.getAllShortFilms);
router.post('/:id', controller.getShortFilmById);
router.put('/:id', fileUploads, controller.updateShortFilm);
router.delete('/:id', controller.deleteShortFilm);

module.exports = router;
