const SeasonEpisodeModel = require('../model/season_episode_model');
const EpisodeAdsModel = require('../model/season_episode_ads_model');
const VideoAdsModel = require('../model/video_ads_model');
// const path = require('path');
exports.createSeasonEpisode = async (req, res) => {
  try {
    const {
      series_id,
      season_id,
      episode_name,
      episode_no,
      video_link,
      released_date,
    } = req.body;

    const cover_img = req.files?.cover_img?.[0]?.path || null;
    const video = req.files?.video?.[0]?.path || null;

    const newEpisode = await SeasonEpisodeModel.create({
      series_id,
      season_id,
      episode_name,
      episode_no,
      video_link,
      released_date,
      cover_img,
      video,
    });

    res.status(201).json({
      status: true,
      message: 'Season episode created successfully',
      data: newEpisode,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error creating season episode',
      data: error.message,
    });
  }
};
exports.getAllSeasonEpisodes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await SeasonEpisodeModel.findAndCountAll({
      limit,
      offset,
    });

    const enhancedEpisodes = await Promise.all(rows.map(async (episode) => {
      const episodeJson = episode.toJSON();

      // Get Ads for this episode
      const EpisodeAdsList = await EpisodeAdsModel.findAll({
        where: { season_episode_id: episode.id },
        include: [
          { model: SeasonEpisodeModel, as: 'season_episode' },
          { model: VideoAdsModel, as: 'video_ad' },
        ],
      });

      episodeJson.episode_ad = EpisodeAdsList;

      return episodeJson;
    }));

    res.status(200).json({
      status: true,
      message: 'Season episodes fetched successfully',
      data: enhancedEpisodes,
      pagination: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching episodes',
      data: error.message,
    });
  }
};


exports.getSeasonEpisodeById = async (req, res) => {
  try {
    const episode = await SeasonEpisodeModel.findByPk(req.params.id);

    if (!episode) {
      return res.status(404).json({
        status: false,
        message: 'Episode not found',
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Episode fetched successfully',
      data: episode,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching episode',
      data: error.message,
    });
  }
};

exports.updateSeasonEpisode = async (req, res) => {
  try {
    const episode = await SeasonEpisodeModel.findByPk(req.params.id);
    if (!episode) {
      return res.status(404).json({
        status: false,
        message: 'Episode not found',
        data: null,
      });
    }

    const {
      series_id,
      season_id,
      episode_name,
      episode_no,
      video_link,
      released_date,
      status,
    } = req.body;

    const cover_img = req.files?.cover_img?.[0]?.path || episode.cover_img;
    const video = req.files?.video?.[0]?.path || episode.video;

    await episode.update({
      series_id,
      season_id,
      episode_name,
      episode_no,
      video_link,
      released_date,
      status,
      cover_img,
      video,
    });

    res.status(200).json({
      status: true,
      message: 'Episode updated successfully',
      data: episode,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error updating episode',
      data: error.message,
    });
  }
};

exports.deleteSeasonEpisode = async (req, res) => {
  try {
    const episode = await SeasonEpisodeModel.findByPk(req.params.id);
    if (!episode) {
      return res.status(404).json({
        status: false,
        message: 'Episode not found'
      });
    }

    await episode.destroy();

    res.status(200).json({
      status: true,
      message: 'Episode deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error deleting episode',
      data: error.message,
    });
  }
};
