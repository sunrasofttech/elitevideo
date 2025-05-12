const ShortFilmRating = require('../model/short_film_rating_model');
const ShortFilm = require('../model/short_film_model');

exports.addShortFilmRating = async (req, res) => {
  try {
    const { short_film_id, user_id, rating } = req.body;

    if (!short_film_id || !user_id || !rating) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const film = await ShortFilm.findByPk(short_film_id);
    if (!film) {
      return res.status(404).json({ status: false, message: "Short film not found" });
    }

    const existing = await ShortFilmRating.findOne({ where: { short_film_id, user_id } });
    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.status(200).json({ status: true, message: "Rating updated successfully", rating: existing });
    }

    const newRating = await ShortFilmRating.create({ short_film_id, user_id, rating });
    return res.status(201).json({ status: true, message: "Rating added successfully", rating: newRating });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to add rating", error: error.message });
  }
};

exports.getShortFilmRating = async (req, res) => {
  try {
    const { short_film_id } = req.params;

    const ratings = await ShortFilmRating.findAll({ where: { short_film_id } });
    if (ratings.length === 0) {
      return res.status(404).json({ status: false, message: "No ratings found for this short film" });
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
