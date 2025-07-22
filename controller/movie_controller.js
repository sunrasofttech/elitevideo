const Movie = require('../model/movie_model');
const MovieLanguage = require('../model/movie_language_model');
const Genre = require('../model/genre_model');
const CastCrew = require('../model/movie_cast_crew_model');
const MovieCategory = require('../model/movie_category_model');
const MovieRating = require('../model/movie_rating_model');
const VideoAdsModel = require('../model/video_ads_model');
const { Op } = require('sequelize');
const MovieAdsModel = require('../model/movie_ads_model');
const ContinueWatching = require('../model/continue_watching_model');
const Message = require('../config/message');


exports.addMovie = async (req, res) => {
    try {
        const { movie_name } = req.body;
        // Check if movie name already exists
        const existingMovie = await Movie.findOne({ where: { movie_name } });
        if (existingMovie) {
            return res.status(400).json({
                status: false,
                message: 'Movie with this name already exists',
            });
        }

        const files = req.files;

        const movieData = {
            ...req.body,
            cover_img: files.cover_img ? files.cover_img[0].path : null,
            poster_img: files.poster_img ? files.poster_img[0].path : null,
            movie_video: files.movie_video ? files.movie_video[0].path : null,
            trailor_video: files.trailor_video ? files.trailor_video[0].path : null
        };
        const movie = await Movie.create(movieData);
        await Message.sendNotification();
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to create movie',
            data: err.message
        });
    }
};


exports.updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files;

        const updateData = {
            ...req.body,
            ...(files.cover_img && { cover_img: files.cover_img[0].path }),
            ...(files.poster_img && { poster_img: files.poster_img[0].path }),
            ...(files.movie_video && { movie_video: files.movie_video[0].path }),
            ...(files.trailor_video && { trailor_video: files.trailor_video[0].path }),
        };

        const [updated] = await Movie.update(updateData, { where: { id } });

        if (!updated) {
            return res.status(404).json({
                status: false,
                message: 'Movie not found',
            });
        }

        const updatedMovie = await Movie.findByPk(id);
        res.json({
            status: true,
            message: 'Movie updated successfully',
            data: updatedMovie
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to update movie',
            data: err.message
        });
    }
};

exports.getAllMovies = async (req, res) => {
    try {
        const { page = 1, limit = 10, movie_name, language_id, category_id } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};

        if (movie_name) {
            whereClause.movie_name = { [Op.like]: `%${movie_name}%` };
        }

        if (language_id) {
            whereClause.movie_language = language_id;
        }

        if (category_id) {
            whereClause.movie_category = category_id;
        }

        const { count, rows } = await Movie.findAndCountAll({
            where: whereClause,
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' },
                {
                    model: MovieRating,
                    as: 'ratings',
                    attributes: ['rating', 'user_id']
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
        });

        const enhancedMovies = await Promise.all(rows.map(async (movie) => {
            const movieJson = movie.toJSON();

            const castCrewList = await CastCrew.findAll({
                where: { movie_id: movie.id }
            });
            movieJson.cast_crew = castCrewList;


            const MovieAdsList = await MovieAdsModel.findAll({
                where: { movie_id: movie.id },
                include: [
                    { model: Movie, as: 'movie' },
                    { model: VideoAdsModel, as: 'video_ad' },
                ]
            });
            movieJson.movie_ad = MovieAdsList;

            const ratings = movieJson.ratings || [];
            if (ratings.length > 0) {
                const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
                movieJson.average_rating = (totalRating / ratings.length).toFixed(2);
                movieJson.total_ratings = ratings.length;
            } else {
                movieJson.average_rating = null;
                movieJson.total_ratings = 0;
            }

            const recommendedMovies = await Movie.findAll({
                where: {
                    movie_category: movie.movie_category,
                    id: { [Op.ne]: movie.id }
                },
                include: [
                    { model: MovieLanguage, as: 'language' },
                    { model: Genre, as: 'genre' },
                    { model: MovieCategory, as: 'category' },
                ],
                limit: 5
            });
            movieJson.recommended_movies = recommendedMovies;

            return movieJson;
        }));
        // try {
        // await Message.sendNotificationToUserDevice('message', 'cIMLCdyIRuWhJDhSfHEVcB:APA91bFfkKzvPMqCvNPzUJq7rb788NpqeQXCC3O8QxPXtHyF7I8CPI0-uvdwSjdMKj4wWwmYMuKA6cKPX-EHNvBaPZ8TVBhX22iEmKZjENhdyM7BnbI7bbM','hello');
        res.json({
            status: true,
            message: 'Movies fetched successfully',
            data: {
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit),
                movies: enhancedMovies
            }
        });
        // } catch (error) {
        //     res.json({
        //         status: true,
        //         message: 'Movies fetched successfully',
        //         data: {
        //             total: count,
        //             page: parseInt(page),
        //             totalPages: Math.ceil(count / limit),
        //             movies: enhancedMovies
        //         }
        //     });
        // }

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch movies',
            data: err.message
        });
    }
};


exports.getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByPk(id, {
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' },
                {
                    model: MovieRating,
                    as: 'ratings',
                    attributes: ['rating', 'user_id']
                }
            ]
        });

        if (!movie) {
            return res.status(404).json({
                status: false,
                message: 'Movie not found',
                data: null
            });
        }

        const castCrewList = await CastCrew.findAll({
            where: { movie_id: id }
        });

        const movieData = movie.toJSON();
        movieData.cast_crew = castCrewList;

        // Calculate average rating
        const ratings = movieData.ratings || [];
        if (ratings.length > 0) {
            const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalRating / ratings.length;
            movieData.average_rating = averageRating.toFixed(2);
            movieData.total_ratings = ratings.length;
        } else {
            movieData.average_rating = null;
            movieData.total_ratings = 0;
        }

        // Show recommended movies
        const recommendedMovies = await Movie.findAll({
            where: {
                movie_category: movie.movie_category,
                id: { [Op.ne]: id },
            },
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' }
            ],
            limit: 10
        });

        movieData.recommended_movies = recommendedMovies;

        res.json({
            status: true,
            message: 'Movie fetched successfully',
            movie: movieData
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch movie',
            data: err.message
        });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Please provide an array of movie IDs to delete.',
            });
        }

        await ContinueWatching.destroy({
            where: {
                type: 'movie',
                type_id: {
                    [Op.in]: ids
                }
            }
        });

        const deleted = await Movie.destroy({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        });

        if (deleted === 0) {
            return res.status(404).json({
                status: false,
                message: 'No movies found to delete.',
            });
        }

        res.json({
            status: true,
            message: `${deleted} movie(s) deleted successfully.`,
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to delete movies',
            data: err.message
        });
    }
};

exports.getHighlightedMovies = async (req, res) => {
    try {
        const highlightedMovies = await Movie.findAll({
            where: { is_highlighted: true },
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' }
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            status: true,
            message: 'Highlighted movies fetched successfully',
            data: highlightedMovies
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch highlighted movies',
            data: err.message
        });
    }
};

exports.getWatchlistMovies = async (req, res) => {
    try {
        const watchlistMovies = await Movie.findAll({
            where: { is_watchlist: true },
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' }
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            status: true,
            message: 'Watchlist movies fetched successfully',
            data: watchlistMovies
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch watchlist movies',
            data: err.message
        });
    }
};

exports.getMostViewedMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        const { count, rows: movies } = await Movie.findAndCountAll({
            where: {
                [Op.or]: [
                    { movie_name: { [Op.like]: `%${search}%` } },
                    { released_by: { [Op.like]: `%${search}%` } },
                    { '$language.name$': { [Op.like]: `%${search}%` } },
                    { '$genre.name$': { [Op.like]: `%${search}%` } },
                    { '$category.name$': { [Op.like]: `%${search}%` } },
                ]
            },
            order: [['view_count', 'DESC']],
            limit,
            offset,
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' },
            ],
        });

        const rankedMovies = movies.map((movie, index) => ({
            rank: offset + index + 1,
            ...movie.toJSON(),
        }));

        res.status(200).json({
            status: true,
            message: "Get all most viewed movies",
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            data: rankedMovies,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch movies.',
            error: error.message,
        });
    }
};