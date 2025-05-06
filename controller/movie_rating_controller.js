const MovieRating = require('../model/movie_rating_model');
const MovieModel = require('../model/movie_model');

// Add a new rating
exports.addRating = async (req, res) => {
  try {
    const { movie_id, user_id, rating } = req.body;

    if (!movie_id || !user_id || !rating) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const movie = await MovieModel.findByPk(movie_id);
    if (!movie) {
      return res.status(404).json({ status: false, message: "Movie not found" });
    }

    const existing = await MovieRating.findOne({ where: { movie_id, user_id } });
    if (existing) {
      return res.status(409).json({ status: false, message: "User has already rated this movie" });
    }

    const newRating = await MovieRating.create({ movie_id, user_id, rating });
    return res.status(201).json({ status: true, message: "Rating added successfully", rating: newRating });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to add rating", error: error.message });
  }
};

exports.getMovieRating = async (req, res) => {
  try {
    const { movie_id } = req.params;

    const ratings = await MovieRating.findAll({ where: { movie_id } });
    if (ratings.length === 0) {
      return res.status(404).json({ status: false, message: "No ratings found for this movie" });
    }

    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const avg = total / ratings.length;

    return res.status(200).json({
      status: true,
      average_rating: avg.toFixed(2),
      total_ratings: ratings.length,
      ratings,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to fetch ratings", error: error.message });
  }
};
