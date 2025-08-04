const SeriesModel = require('../model/series_model');
const MovieLanguage = require('../model/movie_language_model');
const Genre = require('../model/genre_model');
const MovieCategory = require('../model/movie_category_model');
const CastCrew = require('../model/series_cast_crew_model');
const SeasonModel = require('../model/season_model');
const { Op } = require('sequelize');

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
      series_rent_price,
      is_series_on_rent,
      show_subscription,
      rented_time_days,
      is_highlighted,
    } = req.body;

    const cover_img = req.files?.cover_img?.[0]?.location;
    const poster_img = req.files?.poster_img?.[0]?.location;

    const newSeries = await SeriesModel.create({
      series_name,
      status,
      movie_language,
      genre_id,
      movie_category,
      description,
      released_by,
      released_date,
      rented_time_days,
      series_rent_price,
      is_series_on_rent,
      show_subscription,
      cover_img,
      poster_img,
      is_highlighted
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

    const season = await SeasonModel.findAll({
      where: { series_id: series.id },
      order: [['createdAt', 'DESC']],
    });

    const castCrewList = await CastCrew.findAll({
      where: { series_id: series.id },
    });

    const result = {
      ...series.toJSON(),
      season,
      cast_crew: castCrewList,
    };

    return res.status(200).json({
      status: true,
      message: 'Series fetched successfully',
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch series',
      error: err.message,
    });
  }
};

exports.getAllSeries = async (req, res) => {
  try {
    const { name, language, category, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (name) {
      whereClause.series_name = { [Op.like]: `%${name}%` };
    }
    if (language) {
      whereClause.movie_language = language;
    }
    if (category) {
      whereClause.movie_category = category;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: seriesList } = await SeriesModel.findAndCountAll({
      where: whereClause,
      include: [
        { model: MovieLanguage, as: 'language' },
        { model: Genre, as: 'genre' },
        { model: MovieCategory, as: 'category' },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
    });

    const result = await Promise.all(
      seriesList.map(async (series) => {
        const seriesJson = series.toJSON();

        const seasons = await SeasonModel.findAll({
          where: { series_id: series.id },
          order: [['createdAt', 'DESC']],
        });

        const castCrewList = await CastCrew.findAll({
          where: { series_id: series.id },
        });

        return {
          ...seriesJson,
          seasons,
          cast_crew: castCrewList,
        };
      })
    );

    return res.status(200).json({
      status: true,
      message: 'Series fetched successfully',
      data: result,
      pagination: {
        totalItems: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        perPage: parseInt(limit),
      },
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
      series_rent_price,
      is_series_on_rent,
      show_subscription,
      rented_time_days,
      is_highlighted
    } = req.body;

    const cover_img = req.files?.cover_img?.[0]?.location || series.cover_img;
    const poster_img = req.files?.poster_img?.[0]?.location || series.poster_img;

    await series.update({
      series_name,
      status,
      movie_language,
      genre_id,
      movie_category,
      description,
      released_by,
      released_date,
      rented_time_days,
      series_rent_price,
      is_series_on_rent,
      is_highlighted,
      show_subscription,
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
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'No series IDs provided for deletion',
      });
    }

    const deleted = await SeriesModel.destroy({
      where: { id: ids },
    });

    if (deleted === 0) {
      return res.status(404).json({
        status: false,
        message: 'No matching series found to delete',
      });
    }

    return res.status(200).json({
      status: true,
      message: `${deleted} series deleted successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Failed to delete series',
      error: err.message,
    });
  }
};
