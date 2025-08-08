const express = require('express');
const router = express.Router();
const seasonEpisodeAdsController = require('../controller/season_episode_ads_controller');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/',adminAuthenticate, seasonEpisodeAdsController.createSeasonEpisodeAd);
router.post('/getall',adminAuthenticate, seasonEpisodeAdsController.getAllSeasonEpisodeAds);
router.post('/:id',adminAuthenticate, seasonEpisodeAdsController.getSeasonEpisodeAdById);
router.put('/:id',adminAuthenticate, seasonEpisodeAdsController.updateSeasonEpisodeAd);
router.delete('/:id',adminAuthenticate, seasonEpisodeAdsController.deleteSeasonEpisodeAd);

module.exports = router;
