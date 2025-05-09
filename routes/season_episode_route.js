const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const controller = require('../controller/season_episode_controller');

// Create
router.post(
  '/',
  upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  controller.createSeasonEpisode
);

router.post('/get-all', controller.getAllSeasonEpisodes);

router.post('/:id', controller.getSeasonEpisodeById);

router.put(
  '/:id',
  upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  controller.updateSeasonEpisode
);

router.delete('/:id', controller.deleteSeasonEpisode);

module.exports = router;
