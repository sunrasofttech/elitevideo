const express = require('express');
const router = express.Router();
const seriesController = require('../controller/series_controller');
const upload = require('../utils/upload');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

const seriesUpload = upload.fields([
  { name: 'cover_img', maxCount: 1 },
  { name: 'poster_img', maxCount: 1 },
]);

router.post('/', seriesUpload,adminAuthenticate, seriesController.createSeries);
router.post('/admin/get-all',adminAuthenticate,seriesController.getAllSeries);
router.post('/get-all',Authenticate,seriesController.getAllSeries);
router.post('/:id',Authenticate, seriesController.getSeriesById);
router.put('/:id', seriesUpload,adminAuthenticate, seriesController.updateSeries);
router.delete('/',adminAuthenticate, seriesController.deleteSeries);

module.exports = router;
