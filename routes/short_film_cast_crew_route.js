const express = require('express');
const router = express.Router();
const castCrewController = require('../controller/short_film_cast_crew_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/create', upload.single('profile_img'),Authenticate, castCrewController.addCastCrew);
router.post('/get-all',Authenticate, castCrewController.getAllCastCrew);
router.post('/:id',Authenticate, castCrewController.getCastCrewById);
router.put('/:id',Authenticate, upload.single('profile_img'), castCrewController.updateCastCrew);
router.delete('/:id',Authenticate, castCrewController.deleteCastCrew);
router.post('/by-shortfilmId/:shortfilmId',Authenticate, castCrewController.getCastCrewshortfilmId);

module.exports = router;
