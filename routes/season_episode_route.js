const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadToSpace');
const controller = require('../controller/season_episode_controller');
const Authenticate = require('../middleware/jwt_middleware');

// Create
router.post(
  '/',
  upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  Authenticate,
  controller.createSeasonEpisode
);

router.post('/get-all',Authenticate, controller.getAllSeasonEpisodes);

router.post('/:id',Authenticate, controller.getSeasonEpisodeById);

router.put(
  '/:id',
  upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  Authenticate,
  controller.updateSeasonEpisode
);

router.delete('/',Authenticate,controller.deleteSeasonEpisode);

module.exports = router;
