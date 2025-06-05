const SeasonEpisodeAdsModel = require('../model/season_episode_ads_model');
const SeasonEpisodeModel = require('../model/season_episode_model');
const VideoAdsModel = require('../model/video_ads_model');

exports.createSeasonEpisodeAd = async (req, res) => {
  try {
    const { season_episode_id, video_ad_id } = req.body;

    const newAd = await SeasonEpisodeAdsModel.create({
      season_episode_id,
      video_ad_id,
    });

    return res.status(201).json({
      status: true,
      message: 'Season Episode Ad created successfully',
      data: newAd
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to create season episode ad',
      data: error.message
    });
  }
};

exports.getAllSeasonEpisodeAds = async (req, res) => {
  try {
    const ads = await SeasonEpisodeAdsModel.findAll({
      include: [
        { model: SeasonEpisodeModel, as: 'season_episode' },
        { model: VideoAdsModel, as: 'video_ad' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      status: true,
      message: 'Season Episode Ads fetched successfully',
      data: ads
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch season episode ads',
      data: error.message
    });
  }
};

exports.getSeasonEpisodeAdById = async (req, res) => {
  try {
    const ad = await SeasonEpisodeAdsModel.findByPk(req.params.id, {
      include: [
        { model: SeasonEpisodeModel, as: 'season_episode' },
        { model: VideoAdsModel, as: 'video_ad' },
      ]
    });

    if (!ad) {
      return res.status(404).json({
        status: false,
        message: 'Season Episode Ad not found'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Season Episode Ad fetched successfully',
      data: ad
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch season episode ad',
      data: error.message
    });
  }
};

exports.updateSeasonEpisodeAd = async (req, res) => {
  try {
    const { season_episode_id, video_ad_id } = req.body;
    const { id } = req.params;

    const ad = await SeasonEpisodeAdsModel.findByPk(id);
    if (!ad) {
      return res.status(404).json({
        status: false,
        message: 'Season Episode Ad not found',
      });
    }

    await ad.update({
      season_episode_id,
      video_ad_id,
    });

    return res.status(200).json({
      status: true,
      message: 'Season Episode Ad updated successfully',
      data: ad,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to update season episode ad',
      data: error.message,
    });
  }
};


exports.deleteSeasonEpisodeAd = async (req, res) => {
  try {
    const deleted = await SeasonEpisodeAdsModel.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Season Episode Ad not found'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Season Episode Ad deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Failed to delete season episode ad',
      data: error.message
    });
  }
};
