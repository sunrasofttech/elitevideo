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

// Short Film extras
const ShortFilmRatingModel = require('../model/short_film_rating_model');
const ShortfilmAdsModel = require('../model/shortfilm_ads_model');
const ShortFilmCastCrewModel = require('../model/short_flim_cast_crew_model');

// Series extras
const SeasonModel = require('../model/season_model');
const SeriesCastCrewModel = require('../model/series_cast_crew_model');
const SeriesRatingModel = require('../model/series_rating_model');

const getHighlightedContent = async (req, res) => {
    try {
        /** ---------- MOVIES ---------- **/
        const highlightedMoviesRaw = await MovieModel.findAll({
            where: { is_highlighted: true },
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' },
                { model: MovieRating, as: 'ratings', attributes: ['rating', 'user_id'] }
            ],
            order: [
                [MovieModel.sequelize.literal('ISNULL(position), position ASC')],
                ['createdAt', 'DESC']
            ]
        });

        const highlightedMovies = await Promise.all(highlightedMoviesRaw.map(async (movie) => {
            const movieJson = movie.toJSON();

            // Cast & Crew
            movieJson.cast_crew = await CastCrew.findAll({ where: { movie_id: movie.id } });

            // Ads
            movieJson.ads = await MovieAdsModel.findAll({
                where: { movie_id: movie.id },
                include: [{ model: VideoAdsModel, as: 'video_ad' }]
            });

            // Ratings
            const ratings = movieJson.ratings || [];
            if (ratings.length > 0) {
                const total = ratings.reduce((sum, r) => sum + r.rating, 0);
                movieJson.average_rating = (total / ratings.length).toFixed(2);
                movieJson.total_ratings = ratings.length;
            } else {
                movieJson.average_rating = null;
                movieJson.total_ratings = 0;
            }

            // Recommended
            movieJson.recommended_movies = await MovieModel.findAll({
                where: { movie_category: movie.movie_category, id: { [Op.ne]: movie.id } },
                include: [
                    { model: MovieLanguage, as: 'language' },
                    { model: Genre, as: 'genre' },
                    { model: MovieCategory, as: 'category' },
                ],
                limit: 5
            });

            return movieJson;
        }));

        /** ---------- SHORT FILMS ---------- **/
        const highlightedShortFilmsRaw = await ShortFilmModel.findAll({
            where: { is_highlighted: true },
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' },
                { model: ShortFilmRatingModel, as: 'ratings', attributes: ['rating', 'user_id'] }
            ]
        });

        const highlightedShortFilms = await Promise.all(highlightedShortFilmsRaw.map(async (film) => {
            const filmJson = film.toJSON();

            // Ratings
            const ratings = filmJson.ratings || [];
            if (ratings.length > 0) {
                const total = ratings.reduce((sum, r) => sum + r.rating, 0);
                filmJson.average_rating = (total / ratings.length).toFixed(2);
                filmJson.total_ratings = ratings.length;
            } else {
                filmJson.average_rating = null;
                filmJson.total_ratings = 0;
            }

            // Ads
            filmJson.ads = await ShortfilmAdsModel.findAll({
                where: { shortfilm_id: film.id },
                include: [{ model: VideoAdsModel, as: 'video_ad' }]
            });

            // Cast/Crew
            filmJson.cast_crew = await ShortFilmCastCrewModel.findAll({ where: { shortfilm_id: film.id } });

            return filmJson;
        }));

        /** ---------- SERIES ---------- **/
        const highlightedSeriesRaw = await SeriesModel.findAll({
            where: { is_highlighted: true },
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: Genre, as: 'genre' },
                { model: MovieCategory, as: 'category' },
                { model: SeriesRatingModel, as: 'ratings', attributes: ['rating', 'user_id'] }
            ]
        });

        const highlightedSeries = await Promise.all(highlightedSeriesRaw.map(async (series) => {
            const seriesJson = series.toJSON();

            // Ratings
            const ratings = seriesJson.ratings || [];
            if (ratings.length > 0) {
                const total = ratings.reduce((sum, r) => sum + r.rating, 0);
                seriesJson.average_rating = (total / ratings.length).toFixed(2);
                seriesJson.total_ratings = ratings.length;
            } else {
                seriesJson.average_rating = null;
                seriesJson.total_ratings = 0;
            }

            // Seasons
            seriesJson.seasons = await SeasonModel.findAll({
                where: { series_id: series.id },
                order: [['createdAt', 'DESC']]
            });

            // Cast/Crew
            seriesJson.cast_crew = await SeriesCastCrewModel.findAll({ where: { series_id: series.id } });

            return seriesJson;
        }));

        /** ---------- RESPONSE ---------- **/
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

module.exports = { getHighlightedContent };
