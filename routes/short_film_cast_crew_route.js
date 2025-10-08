const express = require('express');
const router = express.Router();
const castCrewController = require('../controller/short_film_cast_crew_controller');
const upload = require('../utils/upload');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');




router.post('/create', upload.single('profile_img'),adminAuthenticate, castCrewController.addCastCrew);
router.post('/get-all',adminAuthenticate, castCrewController.getAllCastCrew);
router.post('/:id',adminAuthenticate, castCrewController.getCastCrewById);
router.put('/:id',adminAuthenticate, upload.single('profile_img'), castCrewController.updateCastCrew);
router.delete('/:id',adminAuthenticate, castCrewController.deleteCastCrew);
router.post('/by-shortfilmId/:shortfilmId',Authenticate, castCrewController.getCastCrewshortfilmId);

module.exports = router;
