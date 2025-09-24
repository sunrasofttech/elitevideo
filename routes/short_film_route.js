const express = require('express');
const router = express.Router();
const controller = require('../controller/short_film_controller');
const upload = require('../utils/upload');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


// Upload multiple fields (name must match front-end form)
const fileUploads = upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'poster_img', maxCount: 1 },
    { name: 'short_video', maxCount: 1 },
]);

router.post('/create', fileUploads,adminAuthenticate, controller.createShortFilm);
router.post('/get-all',Authenticate, controller.getAllShortFilms);
router.post('/admin/get-all',adminAuthenticate, controller.getAllShortFilms);
router.post('/:id',Authenticate, controller.getShortFilmById);
router.post('/admin/:id',adminAuthenticate, controller.getShortFilmById);
router.put('/:id', fileUploads,adminAuthenticate, controller.updateShortFilm);
router.delete('/',adminAuthenticate, controller.deleteShortFilm);

module.exports = router;
