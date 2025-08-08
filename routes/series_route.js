const express = require('express');
const router = express.Router();
const seriesController = require('../controller/series_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');

const seriesUpload = upload.fields([
  { name: 'cover_img', maxCount: 1 },
  { name: 'poster_img', maxCount: 1 },
]);

router.post('/', seriesUpload,Authenticate, seriesController.createSeries);
router.post('/get-all',Authenticate,seriesController.getAllSeries);
router.post('/:id',Authenticate, seriesController.getSeriesById);
router.put('/:id', seriesUpload,Authenticate, seriesController.updateSeries);
router.delete('/',Authenticate, seriesController.deleteSeries);

module.exports = router;
