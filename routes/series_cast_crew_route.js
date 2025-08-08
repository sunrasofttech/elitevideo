const express = require('express');
const router = express.Router();
const castCrewController = require('../controller/series_cast_crew_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');

router.post('/create', upload.single('profile_img'),Authenticate, castCrewController.addCastCrew);
router.post('/get-all',Authenticate, castCrewController.getAllCastCrew);
router.post('/:id',Authenticate, castCrewController.getCastCrewById);
router.put('/:id', upload.single('profile_img'),Authenticate, castCrewController.updateCastCrew);
router.delete('/:id',Authenticate, castCrewController.deleteCastCrew);
router.post('/by-series/:seriesId',Authenticate, castCrewController.getCastCrewBySeriesId);

module.exports = router;
