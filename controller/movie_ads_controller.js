const MovieAdsModel = require('../model/movie_ads_model');
const MovieModel = require('../model/movie_model');
const VideoAdsModel = require('../model/video_ads_model');

exports.createMovieAd = async (req, res) => {
  try {
    const movieAd = await MovieAdsModel.create(req.body);
    res.json({ status: true, message: 'Movie Ad created successfully', data: movieAd });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message, data: null });
  }
};

exports.getAllMovieAds = async (req, res) => {
  try {
    const movieAds = await MovieAdsModel.findAll({
      include: [
        { model: MovieModel, as: 'movie' },
        { model: VideoAdsModel, as: 'video_ad' },
      ]
    });
    res.json({ status: true, message: 'Movie Ads fetched successfully', data: movieAds });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message, data: null });
  }
};

exports.getMovieAdById = async (req, res) => {
  try {
    const movieAd = await MovieAdsModel.findByPk(req.params.id, {
      include: [
        { model: MovieModel, as: 'movie' },
        { model: VideoAdsModel, as: 'video_ad' },
      ]
    });
    if (!movieAd) {
      return res.status(404).json({ status: false, message: 'Movie Ad not found' });
    }
    res.json({ status: true, message: 'Movie Ad fetched successfully', data: movieAd });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateMovieAd = async (req, res) => {
  try {
    const movieAd = await MovieAdsModel.findByPk(req.params.id);
    if (!movieAd) {
      return res.status(404).json({ status: false, message: 'Movie Ad not found' });
    }
    await movieAd.update(req.body);
    res.json({ status: true, message: 'Movie Ad updated successfully', data: movieAd });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.deleteMovieAd = async (req, res) => {
  try {
    const movieAd = await MovieAdsModel.findByPk(req.params.id);
    if (!movieAd) {
      return res.status(404).json({ status: false, message: 'Movie Ad not found' });
    }
    await movieAd.destroy();
    res.json({ status: true, message: 'Movie Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
