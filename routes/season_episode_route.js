const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadToSpace');
const controller = require('../controller/season_episode_controller');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

// Create
router.post(
  '/',
  upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  adminAuthenticate,
  controller.createSeasonEpisode
);

router.post('/get-all',adminAuthenticate, controller.getAllSeasonEpisodes);

router.post('/:id',adminAuthenticate, controller.getSeasonEpisodeById);

router.put(
  '/:id',
  upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  adminAuthenticate,
  controller.updateSeasonEpisode
);

router.delete('/',adminAuthenticate,controller.deleteSeasonEpisode);

module.exports = router;
