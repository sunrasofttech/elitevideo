const ShortFilmModel = require('../model/short_film_model');
const MovieLanguage = require('../model/movie_language_model');
const Genre = require('../model/genre_model');
const MovieCategory = require('../model/movie_category_model');

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
            released_date
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
            released_date,
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

        const { count, rows } = await ShortFilmModel.findAndCountAll({
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            status: true,
            message: "Short films fetched successfully",
            data: rows,
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
                { model: MovieCategory, as: 'category' }
            ],
        });

        if (!film) {
            return res.status(404).json({
                status: false,
                message: "Short film not found",
                data: null,
            });
        }

        return res.status(200).json({
            status: true,
            message: "Short film fetched successfully",
            data: film,
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
        const film = await ShortFilmModel.findByPk(req.params.id);
        if (!film) {
            return res.status(404).json({
                status: false,
                message: "Short film not found",
                data: null,
            });
        }

        await film.destroy();

        return res.status(200).json({
            status: true,
            message: "Short film deleted successfully",
            data: null,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to delete short film",
            data: error.message,
        });
    }
};
