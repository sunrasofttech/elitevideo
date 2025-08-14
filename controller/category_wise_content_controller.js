const MovieModel = require('../model/movie_model');
const SeriesModel = require('../model/series_model');
const ShortFilmModel = require('../model/short_film_model');

const MovieLanguage = require('../model/movie_language_model');
const Genre = require('../model/genre_model');
const MovieCategory = require('../model/movie_category_model');

exports.getCategoryWiseContent = async (req, res) => {
    try {
        const { category_id } = req.query;

        if (!category_id) {
            return res.status(400).json({
                status: false,
                message: "category_id is required"
            });
        }

        // Movies
        const movies = await MovieModel.findAll({
            where: { movie_category: category_id },
            include: [
                { model: MovieLanguage, as: 'language'},
                { model: Genre, as: 'genre'},
                { model: MovieCategory, as: 'category'}
            ]
        });

        // Series
        const series = await SeriesModel.findAll({
            where: { movie_category: category_id },
            include: [
                { model: MovieLanguage, as: 'language'},
                { model: Genre, as: 'genre'},
                { model: MovieCategory, as: 'category' }
            ]
        });

        // Short Films
        const shortFilms = await ShortFilmModel.findAll({
            where: { movie_category: category_id },
            include: [
                { model: MovieLanguage, as: 'language',},
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category'}
            ]
        });

        return res.status(200).json({
            status: true,
            message: "Category-wise content fetched successfully",
            data: {
                movies,
                series,
                shortFilms
            }
        });

    } catch (error) {
        console.error("Error fetching category wise content:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
};
