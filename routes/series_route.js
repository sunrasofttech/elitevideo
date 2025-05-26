const express = require('express');
const router = express.Router();
const seriesController = require('../controller/series_controller');
const upload = require('../utils/upload');

const seriesUpload = upload.fields([
  { name: 'cover_img', maxCount: 1 },
  { name: 'poster_img', maxCount: 1 },
]);

router.post('/', seriesUpload, seriesController.createSeries);
router.post('/get-all', seriesController.getAllSeries);
router.post('/:id', seriesController.getSeriesById);
router.put('/:id', seriesUpload, seriesController.updateSeries);
router.delete('/', seriesController.deleteSeries);

module.exports = router;
