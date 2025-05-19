const express = require('express');
const router = express.Router();
const seasonEpisodeAdsController = require('../controller/season_episode_ads_controller');

router.post('/', seasonEpisodeAdsController.createSeasonEpisodeAd);
router.get('/', seasonEpisodeAdsController.getAllSeasonEpisodeAds);
router.get('/:id', seasonEpisodeAdsController.getSeasonEpisodeAdById);
router.delete('/:id', seasonEpisodeAdsController.deleteSeasonEpisodeAd);

module.exports = router;
