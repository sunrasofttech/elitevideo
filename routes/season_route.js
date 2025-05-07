const express = require('express');
const router = express.Router();
const controller = require('../controller/season_controller');

router.post('/', controller.createSeason);
router.post('/bulk', controller.createMultipleSeasons);
router.post('/get-all', controller.getAllSeasons);
router.post('/:id', controller.getSeasonById);
router.post('/by-series/:series_id', controller.getSeasonsBySeriesId);
router.put('/:id', controller.updateSeason);
router.delete('/:id', controller.deleteSeason);

module.exports = router;
