const SeasonEpisodeModel = require('../model/season_episode_model');
const EpisodeAdsModel = require('../model/season_episode_ads_model');
const VideoAdsModel = require('../model/video_ads_model');
const ContinueWatching = require('../model/continue_watching_model');
const { Op } = require('sequelize');

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
      movie_time,
      movie_rent_price,
      is_movie_on_rent,
      show_type,
      is_highlighted,
    } = req.body;

    const cover_img = req.files?.cover_img?.[0]?.location || null;
    const video = req.files?.video?.[0]?.location || null;

    const newEpisode = await SeasonEpisodeModel.create({
      series_id,
      season_id,
      episode_name,
      episode_no,
      video_link,
      released_date,
      cover_img,
      video,
      movie_time,
      show_type,
      movie_rent_price,
      is_movie_on_rent,
      is_highlighted,
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

    const { name, season_id, series_id,show_type } = req.query;

    const whereClause = {};
    if (name) {
      whereClause.episode_name = { [Op.iLike]: `%${name}%` };
    }
    if (season_id) {
      whereClause.season_id = season_id;
    }
    if (series_id) {
      whereClause.series_id = series_id;
    }
    if (show_type){
      whereClause.show_type = show_type;
    }

    const { count, rows } = await SeasonEpisodeModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    const enhancedEpisodes = await Promise.all(rows.map(async (episode) => {
      const episodeJson = episode.toJSON();

      // Get Ads for this episode
      const EpisodeAdsList = await EpisodeAdsModel.findAll({
        where: { season_episode_id: episode.id },
        include: [
          // { model: SeasonEpisodeModel, as: 'season_episode' },
          { model: VideoAdsModel, as: 'video_ad' },
        ],
      });

      episodeJson.ads = EpisodeAdsList;

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

    const episodeJson = episode.toJSON();

    // Get Ads for this episode
    const EpisodeAdsList = await EpisodeAdsModel.findAll({
      where: { season_episode_id: episode.id },
      include: [
        { model: VideoAdsModel, as: 'video_ad' },
      ],
    });

    episodeJson.ads = EpisodeAdsList;

    res.status(200).json({
      status: true,
      message: 'Episode fetched successfully',
      data: episodeJson,
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
      movie_time,
      movie_rent_price,
      is_movie_on_rent,
      is_highlighted,
      show_type,
    } = req.body;

    const cover_img = req.files?.cover_img?.[0]?.location || episode.cover_img;
    const video = req.files?.video?.[0]?.location || episode.video;

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
      movie_time,
      movie_rent_price,
      is_movie_on_rent,
      is_highlighted,
      show_type,
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
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Please provide an array of episode IDs to delete',
      });
    }

    await ContinueWatching.destroy({
      where: {
        type: 'season_episode',
        type_id: {
          [Op.in]: ids
        }
      }
    });
    const deleted = await SeasonEpisodeModel.destroy({
      where: { id: ids },
    });

    if (deleted === 0) {
      return res.status(404).json({
        status: false,
        message: 'No episodes found to delete',
      });
    }

    return res.status(200).json({
      status: true,
      message: `${deleted} episode(s) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error deleting episodes',
      error: error.message,
    });
  }
};

