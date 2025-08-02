const express = require('express');
const router = express.Router();
const castCrewController = require('../controller/short_film_cast_crew_controller');
const upload = require('../utils/uploadToSpace');

router.post('/create', upload.single('profile_img'), castCrewController.addCastCrew);
router.post('/get-all', castCrewController.getAllCastCrew);
router.post('/:id', castCrewController.getCastCrewById);
router.put('/:id', upload.single('profile_img'), castCrewController.updateCastCrew);
router.delete('/:id', castCrewController.deleteCastCrew);
router.post('/by-shortfilmId/:shortfilmId', castCrewController.getCastCrewshortfilmId);

module.exports = router;
