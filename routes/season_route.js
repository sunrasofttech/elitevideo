const express = require('express');
const router = express.Router();
const controller = require('../controller/season_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/',Authenticate, controller.createSeason);
router.post('/bulk',Authenticate, controller.createMultipleSeasons);
router.post('/get-all',Authenticate, controller.getAllSeasons);
router.post('/:id',Authenticate, controller.getSeasonById);
router.post('/by-series/:series_id',Authenticate, controller.getSeasonsBySeriesId);
router.put('/:id',Authenticate, controller.updateSeason);
router.delete('/:id',Authenticate, controller.deleteSeason);

module.exports = router;
