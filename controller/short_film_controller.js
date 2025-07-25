const ShortFilmModel = require('../model/short_film_model');
const MovieLanguage = require('../model/movie_language_model');
const Genre = require('../model/genre_model');
const MovieCategory = require('../model/movie_category_model');
const ShortFilmRatingModel = require('../model/short_film_rating_model');
const ShortfilmAdsModel = require('../model/shortfilm_ads_model');
const ShortFilmCastCrewModel = require('../model/short_flim_cast_crew_model');
const VideoAdsModel = require('../model/video_ads_model');
const ContinueWatching = require('../model/continue_watching_model');
const { Op } = require('sequelize');

const extractFilePath = (file) => (file ? file.path.replace(/\\/g, '/') : null);

exports.createShortFilm = async (req, res) => {
    try {
        const {
            short_film_title,
            status,
            movie_language,
            genre_id,
            movie_category,
            video_link,
            quality,
            subtitle,
            description,
            movie_time,
            movie_rent_price,
            is_movie_on_rent,
            is_highlighted,
            is_watchlist,
            released_by,
            released_date,
            show_subscription,
            rented_time_days
        } = req.body;


        const existingFilm = await ShortFilmModel.findOne({ where: { short_film_title } });
        if (existingFilm) {
            return res.status(400).json({
                status: false,
                message: "Short film with this title already exists",
            });
        }

        const newFilm = await ShortFilmModel.create({
            short_film_title,
            status,
            movie_language,
            genre_id,
            movie_category,
            video_link,
            quality,
            subtitle,
            description,
            movie_time,
            movie_rent_price,
            is_movie_on_rent,
            is_highlighted,
            is_watchlist,
            released_by,
            show_subscription,
            released_date,
            rented_time_days,
            cover_img: extractFilePath(req.files?.cover_img?.[0]),
            poster_img: extractFilePath(req.files?.poster_img?.[0]),
            short_video: extractFilePath(req.files?.short_video?.[0]),
        });

        return res.status(201).json({
            status: true,
            message: "Short film created successfully",
            data: newFilm,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to create short film",
            data: error.message,
        });
    }
};

exports.getAllShortFilms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { short_film_title, language, genre } = req.query;
        const whereClause = {};

        if (short_film_title) {
            whereClause.short_film_title = {
                [Op.like]: `%${short_film_title}%`
            };
        }

        if (language) {
            whereClause.movie_language = language;
        }

        if (genre) {
            whereClause.genre_id = genre;
        }

        const { count, rows } = await ShortFilmModel.findAndCountAll({
            where: whereClause,
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' },
                {
                    model: ShortFilmRatingModel,
                    as: 'ratings',
                    attributes: ['rating', 'user_id']
                }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        const enhancedFilms = await Promise.all(rows.map(async (film) => {
            const filmJson = film.toJSON();
            const ratings = filmJson.ratings || [];

            // Ratings
            if (ratings.length > 0) {
                const total = ratings.reduce((sum, r) => sum + r.rating, 0);
                filmJson.average_rating = (total / ratings.length).toFixed(2);
                filmJson.total_ratings = ratings.length;
            } else {
                filmJson.average_rating = null;
                filmJson.total_ratings = 0;
            }

            // Ads
            const shortfilmAds = await ShortfilmAdsModel.findAll({
                where: { shortfilm_id: film.id },
                include: [
                    // { model: ShortFilmModel, as: 'shortfilm' },
                    { model: VideoAdsModel, as: 'video_ad' },
                ]
            });
            filmJson.ads = shortfilmAds;

            // Cast/Crew
            const castCrewList = await ShortFilmCastCrewModel.findAll({
                where: { shortfilm_id: film.id }
            });
            filmJson.cast_crew = castCrewList;

            return filmJson;
        }));

        return res.status(200).json({
            status: true,
            message: "Short films fetched successfully",
            data: enhancedFilms,
            pagination: {
                totalItems: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch short films",
            data: error.message,
        });
    }
};

exports.getShortFilmById = async (req, res) => {
    try {
        const film = await ShortFilmModel.findByPk(req.params.id, {
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' },
                {
                    model: ShortFilmRatingModel,
                    as: 'ratings',
                    attributes: ['rating', 'user_id']
                }
            ],
        });

        if (!film) {
            return res.status(404).json({
                status: false,
                message: "Short film not found",
                data: null,
            });
        }

        const filmJson = film.toJSON();
        const ratings = filmJson.ratings || [];

        // Ratings
        if (ratings.length > 0) {
            const total = ratings.reduce((sum, r) => sum + r.rating, 0);
            filmJson.average_rating = (total / ratings.length).toFixed(2);
            filmJson.total_ratings = ratings.length;
        } else {
            filmJson.average_rating = null;
            filmJson.total_ratings = 0;
        }

        // Ads
        const shortfilmAds = await ShortfilmAdsModel.findAll({
            where: { shortfilm_id: film.id },
            include: [
                // { model: ShortFilmModel, as: 'shortfilm' },
                { model: VideoAdsModel, as: 'video_ad' },
            ]
        });
        filmJson.ads = shortfilmAds;

        // Cast/Crew
        const castCrewList = await ShortFilmCastCrewModel.findAll({
            where: { shortfilm_id: film.id }
        });
        filmJson.cast_crew = castCrewList;

        return res.status(200).json({
            status: true,
            message: "Short film fetched successfully",
            shortfilm: filmJson,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch short film",
            data: error.message,
        });
    }
};


exports.updateShortFilm = async (req, res) => {
    try {
        const film = await ShortFilmModel.findByPk(req.params.id);
        if (!film) {
            return res.status(404).json({
                status: false,
                message: "Short film not found",
                data: null,
            });
        }

        const updates = {
            ...req.body,
            cover_img: extractFilePath(req.files?.cover_img?.[0]) || film.cover_img,
            poster_img: extractFilePath(req.files?.poster_img?.[0]) || film.poster_img,
            short_video: extractFilePath(req.files?.short_video?.[0]) || film.short_video,
        };

        await film.update(updates);

        return res.status(200).json({
            status: true,
            message: "Short film updated successfully",
            data: film,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to update short film",
            data: error.message,
        });
    }
};

exports.deleteShortFilm = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No film IDs provided",
      });
    }

    await ContinueWatching.destroy({
            where: {
                type: 'shortfilm',
                type_id: {
                 [Op.in]: ids
                }
            }
        });
        
    const deleted = await ShortFilmModel.destroy({
      where: { id: ids }
    });

    return res.status(200).json({
      status: true,
      message: `${deleted} short film(s) deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to delete short films",
      data: error.message,
    });
  }
};
