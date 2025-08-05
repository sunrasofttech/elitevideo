const SeasonEpisodeAdsModel = require('../model/season_episode_ads_model');
const SeasonEpisodeModel = require('../model/season_episode_model');
const VideoAdsModel = require('../model/video_ads_model');

exports.createSeasonEpisodeAd = async (req, res) => {
  try {
    const { season_episode_id, video_ad_id,show_type } = req.body;

    const newAd = await SeasonEpisodeAdsModel.create({
      season_episode_id,
      video_ad_id,
      show_type,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await SeasonEpisodeAdsModel.findAndCountAll({
      include: [
        { model: SeasonEpisodeModel, as: 'season_episode' },
        { model: VideoAdsModel, as: 'video_ad' },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return res.status(200).json({
      status: true,
      message: 'Season Episode Ads fetched successfully',
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      }
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
    const { season_episode_id, video_ad_id,show_type } = req.body;
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
      show_type,
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
