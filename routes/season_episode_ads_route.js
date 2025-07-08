const express = require('express');
const router = express.Router();
const seasonEpisodeAdsController = require('../controller/season_episode_ads_controller');

router.post('/', seasonEpisodeAdsController.createSeasonEpisodeAd);
router.post('/getall', seasonEpisodeAdsController.getAllSeasonEpisodeAds);
router.post('/:id', seasonEpisodeAdsController.getSeasonEpisodeAdById);
router.put('/:id', seasonEpisodeAdsController.updateSeasonEpisodeAd);
router.delete('/:id', seasonEpisodeAdsController.deleteSeasonEpisodeAd);

module.exports = router;
