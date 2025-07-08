const WatchlistModel = require('../model/watchlist_model');
const UserModel = require('../model/user_model');
const MovieModel = require('../model/movie_model');
const ShortfilmModel = require('../model/short_film_model');
const SeasonEpisodeModel = require('../model/season_episode_model');
const CastCrew = require('../model/movie_cast_crew_model');
const MovieAdsModel = require('../model/movie_ads_model');
const VideoAdsModel = require('../model/video_ads_model');
const MovieLanguage = require('../model/movie_language_model');
const Genre = require('../model/genre_model');
const MovieCategory = require('../model/movie_category_model');
const MovieRating = require('../model/movie_rating_model');
const { Op } = require('sequelize');

exports.addToWatchlist = async (req, res) => {
    try {
        const { user_id, type, movie_id, shortfilm_id, season_episode_id } = req.body;

        if (!user_id || !type || (type === 'movie' && !movie_id) || (type === 'shortfilm' && !shortfilm_id) || (type === 'season_episode' && !season_episode_id)) {
            return res.status(400).json({ status: false, message: 'Invalid payload' });
        }

        const existing = await WatchlistModel.findOne({
            where: {
                user_id,
                type,
                movie_id: type === 'movie' ? movie_id : null,
                shortfilm_id: type === 'shortfilm' ? shortfilm_id : null,
                season_episode_id: type === 'season_episode' ? season_episode_id : null,
            },
        });

        if (existing) {
            return res.status(200).json({ status: false, message: "Already added to watchlist." });
        }

        const entry = await WatchlistModel.create({
            user_id,
            type,
            movie_id: type === 'movie' ? movie_id : null,
            shortfilm_id: type === 'shortfilm' ? shortfilm_id : null,
            season_episode_id: type === 'season_episode' ? season_episode_id : null,
        });
        res.status(201).json({ status: true, message: "Watchlist created successfully.", entry });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


const enrichMovie = async (movie) => {
    const movieJson = movie.toJSON();

    const castCrewList = await CastCrew.findAll({ where: { movie_id: movie.id } });
    movieJson.cast_crew = castCrewList;

    const MovieAdsList = await MovieAdsModel.findAll({
        where: { movie_id: movie.id },
        include: [
            { model: MovieModel, as: 'movie' },
            { model: VideoAdsModel, as: 'video_ad' },
        ]
    });
    movieJson.movie_ad = MovieAdsList;

    const ratings = await MovieRating.findAll({ where: { movie_id: movie.id } });
    if (ratings.length > 0) {
        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        movieJson.average_rating = (totalRating / ratings.length).toFixed(2);
        movieJson.total_ratings = ratings.length;
    } else {
        movieJson.average_rating = null;
        movieJson.total_ratings = 0;
    }

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
};


exports.getUserWatchlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const { type } = req.query;

        const includeOptions = [];

        if (!type || type === 'movie') {
            includeOptions.push({ model: MovieModel, as: 'movie', required: type === 'movie' });
        }
        if (!type || type === 'shortfilm') {
            includeOptions.push({ model: ShortfilmModel, as: 'shortfilm', required: type === 'shortfilm' });
        }
        if (!type || type === 'season_episode') {
            includeOptions.push({ model: SeasonEpisodeModel, as: 'season_episode', required: type === 'season_episode' });
        }

        const watchlist = await WatchlistModel.findAll({
            where: { user_id: userId },
            include: includeOptions
        });

        const filtered = watchlist.filter(item =>
            (type === 'movie' && item.movie) ||
            (type === 'shortfilm' && item.shortfilm) ||
            (type === 'season_episode' && item.season_episode) ||
            !type
        );

        if (type === 'movie') {
            finalWatchlist = await Promise.all(
                filtered.map(async (item) => {
                    if (item.movie) return await enrichMovie(item.movie);
                })
            );
            finalWatchlist = finalWatchlist.filter(Boolean);
        } else {
            finalWatchlist = filtered;
        }



        res.status(200).json({
            status: true,
            message: "Watchlist fetched successfully.",
            watchlist: filtered,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


exports.removeFromWatchlist = async (req, res) => {
    try {
        const { userId, type, id } = req.params;

        if (!userId || !type || !id) {
            return res.status(400).json({ status: false, message: 'Missing required parameters' });
        }

        const whereClause = { user_id: userId, type };

        // Add the appropriate field based on type
        if (type === 'movie') whereClause.movie_id = id;
        else if (type === 'shortfilm') whereClause.shortfilm_id = id;
        else if (type === 'season_episode') whereClause.season_episode_id = id;
        else return res.status(400).json({ message: 'Invalid type' });

        const deleted = await WatchlistModel.destroy({ where: whereClause });

        if (deleted) {
            res.status(200).json({ status: true, message: `${type} removed from watchlist` });
        } else {
            res.status(404).json({ status: false, message: 'Watchlist entry not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};
