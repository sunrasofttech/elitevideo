const MovieModel = require('../models/movie_model');
const ShortFilmModel = require('../models/short_film_model');
const SeriesModel = require('../models/series_model');

const getHighlightedContent = async (req, res) => {
    try {
        const highlightedMovies = await MovieModel.findAll({
            where: { is_highlighted: true },
            include: ['language', 'genre', 'category'],
        });

        const highlightedShortFilms = await ShortFilmModel.findAll({
            where: { is_highlighted: true },
            include: ['language', 'genre', 'category'],
        });

        const highlightedSeries = await SeriesModel.findAll({
            where: { is_highlighted: true },
            include: ['language', 'genre', 'category'],
        });

        return res.status(200).json({
            status: true,
            message: "All Highlighted data Fetched",
            data:{
                movies: highlightedMovies,
                shortFilms: highlightedShortFilms,
                series: highlightedSeries,
            }
           
        });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error', error });
}
};

module.exports = {
    getHighlightedContent,
};
