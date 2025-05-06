const Movie = require('../model/movie_model');
const MovieLanguage = require('../model/movie_language_model');
const Genre = require('../model/genre_model');
const CastCrew = require('../model/cast_crew_model');


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

        res.status(201).json({
            status: true,
            message: 'Movie created successfully',
            data: movie
        });
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
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await Movie.findAndCountAll({
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
        });

        res.json({
            status: true,
            message: 'Movies fetched successfully',
            data: {
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit),
                movies: rows
            }
        });
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
                { model: Genre, as: 'genre' }
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

        res.json({
            status: true,
            message: 'Movie fetched successfully',
            data: movieData
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
        const deleted = await Movie.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({
                status: false,
                message: 'Movie not found',
            });
        }
        res.json({
            status: true,
            message: 'Movie deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to delete movie',
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
                { model: Genre, as: 'genre' }
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