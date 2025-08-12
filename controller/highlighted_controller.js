const { Op } = require('sequelize');
const MovieModel = require('../model/movie_model');
const ShortFilmModel = require('../model/short_film_model');
const SeriesModel = require('../model/series_model');
const MovieLanguage = require('../model/movie_language_model');
const Genre = require('../model/genre_model');
const MovieCategory = require('../model/movie_category_model');
const MovieRating = require('../model/movie_rating_model');
const CastCrew = require('../model/movie_cast_crew_model');
const MovieAdsModel = require('../model/movie_ads_model');
const VideoAdsModel = require('../model/video_ads_model');

const getHighlightedContent = async (req, res) => {
    try {
        // ---------- Highlighted Movies ----------
        const highlightedMoviesRaw = await MovieModel.findAll({
            where: { is_highlighted: true },
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' },
                {
                    model: MovieRating,
                    as: 'ratings',
                    attributes: ['rating', 'user_id']
                }
            ],
            order: [
                [MovieModel.sequelize.literal('ISNULL(position), position ASC')],
                ['createdAt', 'DESC']
            ]
        });

        const highlightedMovies = await Promise.all(highlightedMoviesRaw.map(async (movie) => {
            const movieJson = movie.toJSON();

            // Cast & Crew
            const castCrewList = await CastCrew.findAll({
                where: { movie_id: movie.id }
            });
            movieJson.cast_crew = castCrewList;

            // Ads
            const MovieAdsList = await MovieAdsModel.findAll({
                where: { movie_id: movie.id },
                include: [{ model: VideoAdsModel, as: 'video_ad' }]
            });
            movieJson.ads = MovieAdsList;

            // Ratings
            const ratings = movieJson.ratings || [];
            if (ratings.length > 0) {
                const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
                movieJson.average_rating = (totalRating / ratings.length).toFixed(2);
                movieJson.total_ratings = ratings.length;
            } else {
                movieJson.average_rating = null;
                movieJson.total_ratings = 0;
            }

            // Recommended Movies
            const recommendedMovies = await MovieModel.findAll({
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

        // ---------- Highlighted Short Films ----------
        const highlightedShortFilms = await ShortFilmModel.findAll({
            where: { is_highlighted: true },
            include: ['language', 'genre', 'category']
        });

        // ---------- Highlighted Series ----------
        const highlightedSeries = await SeriesModel.findAll({
            where: { is_highlighted: true },
            include: ['language', 'genre', 'category']
        });

        return res.status(200).json({
            status: true,
            message: "All Highlighted data Fetched",
            data: {
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
