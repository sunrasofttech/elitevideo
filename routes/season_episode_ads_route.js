const express = require('express');
const router = express.Router();
const seasonEpisodeAdsController = require('../controller/season_episode_ads_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/',Authenticate, seasonEpisodeAdsController.createSeasonEpisodeAd);
router.post('/getall',Authenticate, seasonEpisodeAdsController.getAllSeasonEpisodeAds);
router.post('/:id',Authenticate, seasonEpisodeAdsController.getSeasonEpisodeAdById);
router.put('/:id',Authenticate, seasonEpisodeAdsController.updateSeasonEpisodeAd);
router.delete('/:id',Authenticate, seasonEpisodeAdsController.deleteSeasonEpisodeAd);

module.exports = router;
