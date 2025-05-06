const express = require('express');
const router = express.Router();
const castCrewController = require('../controller/cast_crew_controller');
const upload = require('../utils/upload');

router.post('/create', upload.single('profile_img'), castCrewController.addCastCrew);
router.post('/get-all', castCrewController.getAllCastCrew);
router.post('/:id', castCrewController.getCastCrewById);
router.put('/:id', upload.single('profile_img'), castCrewController.updateCastCrew);
router.delete('/:id', castCrewController.deleteCastCrew);
router.post('/by-movie/:movieId', castCrewController.getCastCrewByMovieId);

module.exports = router;
