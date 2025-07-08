const SeriesRating = require('../model/series_rating_model');
const SeriesModel = require('../model/series_model');

exports.addRating = async (req, res) => {
  try {
    const { series_id, user_id, rating } = req.body;

    if (!series_id || !user_id || !rating) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const series = await SeriesModel.findByPk(series_id);
    if (!series) {
      return res.status(404).json({ status: false, message: "series not found" });
    }

    // Check if rating exists
    const existing = await SeriesRating.findOne({ where: { series_id, user_id } });
    if (existing) {
      // Update rating
      existing.rating = rating;
      await existing.save();
      return res.status(200).json({ status: true, message: "Rating updated successfully", rating: existing });
    }

    // Create new rating
    const newRating = await SeriesRating.create({ series_id, user_id, rating });
    return res.status(201).json({ status: true, message: "Rating added successfully", rating: newRating });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Failed to add rating", error: error.message });
  }
};

exports.getSeriesRating = async (req, res) => {
  try {
    const { series_id } = req.params;

    const ratings = await SeriesRating.findAll({ where: { series_id } });

    let avg = 0.0;
    if (ratings.length > 0) {
      const total = ratings.reduce((sum, r) => sum + r.rating, 0);
      avg = total / ratings.length;
    }

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
