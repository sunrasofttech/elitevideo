const express = require('express');
const router = express.Router();
const castCrewController = require('../controller/movie_cast_crew_controller');
const upload = require('../utils/upload');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/create', upload.single('profile_img'),adminAuthenticate, castCrewController.addCastCrew);
router.post('/get-all',adminAuthenticate, castCrewController.getAllCastCrew);
router.post('/:id',adminAuthenticate, castCrewController.getCastCrewById);
router.put('/:id', upload.single('profile_img'),adminAuthenticate, castCrewController.updateCastCrew);
router.delete('/:id',adminAuthenticate, castCrewController.deleteCastCrew);
router.post('/by-movie/:movieId',Authenticate, castCrewController.getCastCrewByMovieId);

module.exports = router;
