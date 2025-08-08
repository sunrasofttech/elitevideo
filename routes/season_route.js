const express = require('express');
const router = express.Router();
const controller = require('../controller/season_controller');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/',adminAuthenticate, controller.createSeason);
router.post('/bulk',adminAuthenticate, controller.createMultipleSeasons);
router.post('/get-all',adminAuthenticate, controller.getAllSeasons);
router.post('/:id',adminAuthenticate, controller.getSeasonById);
router.post('/by-series/:series_id',adminAuthenticate, controller.getSeasonsBySeriesId);
router.put('/:id',adminAuthenticate, controller.updateSeason);
router.delete('/:id',adminAuthenticate, controller.deleteSeason);

module.exports = router;
