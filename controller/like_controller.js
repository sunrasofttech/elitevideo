const LikeModel = require('../model/like_model');
const MovieModel = require('../model/movie_model');
const ShortfilmModel = require('../model/short_film_model');
const SeasonEpisodeModel = require('../model/season_episode_model');

exports.addLike = async (req, res) => {
  try {
    const { user_id, type, movie_id, shortfilm_id, season_episode_id } = req.body;

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

    // Check if already liked
    const existing = await LikeModel.findOne({ where: whereClause });

    if (existing) {
      // Already liked => Dislike (remove like)
      await existing.destroy();
      return res.status(200).json({ status: true, message: "Like removed (disliked)", data: null });
    }

    // Not liked yet => Add like
    const entry = await LikeModel.create(whereClause);
    return res.status(201).json({ status: true, message: "Like added successfully", data: entry });

  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, data: null });
  }
};


// Get user likes
exports.getUserLikes = async (req, res) => {
  try {
    const { userId } = req.params;

    const likes = await LikeModel.findAll({
      where: { user_id: userId },
      include: [
        { model: MovieModel, as: 'movie' },
        { model: ShortfilmModel, as: 'shortfilm' },
        { model: SeasonEpisodeModel, as: 'season_episode' },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ status: true, message: "User likes fetched successfully", data: likes });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message, data: null });
  }
};
