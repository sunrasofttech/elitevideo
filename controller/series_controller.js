const SeriesModel = require('../model/series_model');
const MovieLanguage = require('../model/movie_language_model');
const Genre = require('../model/genre_model');
const MovieCategory = require('../model/movie_category_model');

exports.createSeries = async (req, res) => {
  try {
    const {
      series_name,
      status,
      movie_language,
      genre_id,
      movie_category,
      description,
      released_by,
      released_date,
    } = req.body;

    const cover_img = req.files?.cover_img?.[0]?.filename || null;
    const poster_img = req.files?.poster_img?.[0]?.filename || null;

    const newSeries = await SeriesModel.create({
      series_name,
      status,
      movie_language,
      genre_id,
      movie_category,
      description,
      released_by,
      released_date,
      cover_img,
      poster_img,
    });

    return res.status(201).json({
      status: true,
      message: 'Series created successfully',
      data: newSeries,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Failed to create series',
      error: err.message,
    });
  }
};

exports.getAllSeries = async (req, res) => {
  try {
    const seriesList = await SeriesModel.findAll({
      include: [
        { model: MovieLanguage, as: 'language' },
        { model: Genre, as: 'genre' },
        { model: MovieCategory, as: 'category' },
      ],
    });

    return res.status(200).json({
      status: true,
      message: 'Series fetched successfully',
      data: seriesList,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch series',
      error: err.message,
    });
  }
};

exports.getSeriesById = async (req, res) => {
  try {
    const { id } = req.params;

    const series = await SeriesModel.findByPk(id, {
      include: [
        { model: MovieLanguage, as: 'language' },
        { model: Genre, as: 'genre' },
        { model: MovieCategory, as: 'category' },
      ],
    });

    if (!series) {
      return res.status(404).json({
        status: false,
        message: 'Series not found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Series fetched successfully',
      data: series,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch series',
      error: err.message,
    });
  }
};

exports.updateSeries = async (req, res) => {
  try {
    const { id } = req.params;

    const series = await SeriesModel.findByPk(id);
    if (!series) {
      return res.status(404).json({
        status: false,
        message: 'Series not found',
        data: null,
      });
    }

    const {
      series_name,
      status,
      movie_language,
      genre_id,
      movie_category,
      description,
      released_by,
      released_date,
    } = req.body;

    const cover_img = req.files?.cover_img?.[0]?.filename || series.cover_img;
    const poster_img = req.files?.poster_img?.[0]?.filename || series.poster_img;

    await series.update({
      series_name,
      status,
      movie_language,
      genre_id,
      movie_category,
      description,
      released_by,
      released_date,
      cover_img,
      poster_img,
    });

    return res.status(200).json({
      status: true,
      message: 'Series updated successfully',
      data: series,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Failed to update series',
      data: null,
      error: err.message,
    });
  }
};

exports.deleteSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SeriesModel.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Series not found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Series deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Failed to delete series',
      error: err.message,
    });
  }
};
