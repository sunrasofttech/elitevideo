const ContinueWatching = require('../model/continue_watching_model');
const MovieModel = require('../model/movie_model');
const ShortFilmModel = require('../model/short_film_model');
const SeasonEpisodeModel = require('../model/season_episode_model');
const MovieAdsModel = require('../model/movie_ads_model');
const VideoAdsModel = require('../model/video_ads_model');
const ShortfilmAdsModel = require('../model/shortfilm_ads_model');
const EpisodeAdsModel = require('../model/season_episode_ads_model');


exports.getContinueWatching = async (req, res) => {
  try {
    const { user_id, type } = req.query;

    if (!user_id) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const whereCondition = { user_id, is_watched: false };
    if (type) {
      whereCondition.type = type;
    }

    const continueWatchList = await ContinueWatching.findAll({
      where: whereCondition,
      order: [["updatedAt", "DESC"]],
    });

    const enrichedList = await Promise.all(
      continueWatchList.map(async (item) => {
        let content = null;
        let ads = [];

        if (item.type === "movie") {
          content = await MovieModel.findByPk(item.type_id);
          ads = await MovieAdsModel.findAll({
            where: { movie_id: item.type_id },
            include: [
              { model: MovieModel, as: "movie" },
              { model: VideoAdsModel, as: "video_ad" },
            ],
          });
        } else if (item.type === "shortfilm") {
          content = await ShortFilmModel.findByPk(item.type_id);
          ads = await ShortfilmAdsModel.findAll({
            where: { shortfilm_id: item.type_id },
            include: [
              { model: ShortFilmModel, as: "shortfilm" },
              { model: VideoAdsModel, as: "video_ad" },
            ],
          });
        } else if (item.type === "season_episode") {
          content = await SeasonEpisodeModel.findByPk(item.type_id);
          ads = await EpisodeAdsModel.findAll({
            where: { season_episode_id: item.type_id },
            include: [
              { model: SeasonEpisodeModel, as: "season_episode" },
              { model: VideoAdsModel, as: "video_ad" },
            ],
          });
        }

        return {
          ...item.toJSON(),
          content,
          ads,
        };
      })
    );

    return res.status(200).json({
      status: true,
      message: "Continue Watching list fetched successfully",
      data: enrichedList,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch continue watching list",
      error: error.message,
    });
  }
};


exports.saveProgress = async (req, res) => {
    try {
        const { user_id, type, type_id, current_time, is_watched } = req.body;

        const existing = await ContinueWatching.findOne({
            where: { user_id, type, type_id }
        });

        if (existing) {
            await existing.update({ current_time, is_watched });
            return res.status(200).json({
                status: true,
                message: 'Progress updated',
                data: existing,
            });
        }

        const entry = await ContinueWatching.create({
            user_id,
            type,
            type_id,
            current_time,
            is_watched,
        });

        return res.status(200).json({
            status: true,
            message: 'Progress saved',
            data: entry,
        });

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: 'Error saving progress',
            error: err.message,
        });
    }
};
