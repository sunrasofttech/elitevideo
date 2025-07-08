const WatchlistModel = require('../model/watchlist_model');
const UserModel = require('../model/user_model');
const MovieModel = require('../model/movie_model');
const ShortfilmModel = require('../model/short_film_model');
const SeasonEpisodeModel = require('../model/season_episode_model');

exports.addToWatchlist = async (req, res) => {
    try {
        const { user_id, type, movie_id, shortfilm_id, season_episode_id } = req.body;

        if (!user_id || !type || (type === 'movie' && !movie_id) || (type === 'shortfilm' && !shortfilm_id) || (type === 'season_episode' && !season_episode_id)) {
            return res.status(400).json({ status: false, message: 'Invalid payload' });
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
            return res.status(400).json({status:false, message: 'Missing required parameters' });
        }

        const whereClause = { user_id: userId, type };

        // Add the appropriate field based on type
        if (type === 'movie') whereClause.movie_id = id;
        else if (type === 'shortfilm') whereClause.shortfilm_id = id;
        else if (type === 'season_episode') whereClause.season_episode_id = id;
        else return res.status(400).json({ message: 'Invalid type' });

        const deleted = await WatchlistModel.destroy({ where: whereClause });

        if (deleted) {
            res.status(200).json({status:true, message: `${type} removed from watchlist` });
        } else {
            res.status(404).json({status:false, message: 'Watchlist entry not found' });
        }
    } catch (error) {
        res.status(500).json({status:false, message: error.message });
    }
};
