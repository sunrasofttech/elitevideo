const LikeModel = require('../model/like_model');
const MovieModel = require('../model/movie_model');
const ShortfilmModel = require('../model/short_film_model');
const SeasonEpisodeModel = require('../model/season_episode_model');

exports.addLike = async (req, res) => {
  try {
    const { user_id, type, movie_id, shortfilm_id, season_episode_id, liked, disliked } = req.body;

    if (!user_id || !type) {
      return res.status(400).json({ status: false, message: "Missing required fields", data: null });
    }

    const whereClause = {
      user_id,
      type,
      movie_id: type === 'movie' ? movie_id : null,
      shortfilm_id: type === 'shortfilm' ? shortfilm_id : null,
      season_episode_id: type === 'season_episode' ? season_episode_id : null
    };

    const existing = await LikeModel.findOne({ where: whereClause });

    if (existing) {
      if (liked) {
        existing.liked = true;
        existing.disliked = false;
      } else if (disliked) {
        existing.disliked = true;
        existing.liked = false;
      }
      await existing.save();
      return res.status(200).json({
        status: true,
        message: "Like/dislike updated",
        data: existing
      });
    }

    // New like/dislike
    const newEntry = await LikeModel.create({
      ...whereClause,
      liked: liked ? true : false,
      disliked: disliked ? true : false,
    });

    return res.status(201).json({
      status: true,
      message: "Like/dislike added",
      data: newEntry
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
      data: null
    });
  }
};

// Get user likes
exports.getUserLikes = async (req, res) => {
  try {
    const { user_id, type, type_id } = req.query;

    if (!user_id || !type || !type_id) {
      return res.status(400).json({
        status: false,
        message: "Missing required query parameters",
      });
    }

    const whereClause = {
      user_id,
      type,
      movie_id: type === 'movie' ? type_id : null,
      shortfilm_id: type === 'shortfilm' ? type_id : null,
      season_episode_id: type === 'season_episode' ? type_id : null,
    };

    const existingLike = await LikeModel.findOne({ where: whereClause });

    if (existingLike) {
      return res.status(200).json({
        status: true,
        message: "User has liked this item",
        // liked: true,
        data: existingLike,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "User has not liked this item",
        // liked: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};