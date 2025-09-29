const express = require('express');
const router = express.Router();
const trailorController = require('../controller/trailor_controller');
const upload = require('../utils/upload');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

const movieUploads = upload.fields([
  { name: 'cover_img', maxCount: 1 },
  { name: 'poster_img', maxCount: 1 },
  { name: 'trailor_video', maxCount: 1 }
]);

// CRUD routes
router.post('/', movieUploads,trailorController.addTrailor);
router.put('/:id',movieUploads, trailorController.updateTrailor);
router.get('/', trailorController.getAllTrailors);
router.get('/:id', trailorController.getTrailorById);
router.delete('/', trailorController.deleteTrailors);

module.exports = router;