const RecentSearch = require('../model/recent_search_model');
const User = require('../model/user_model');
const Movie = require('../model/movie_model');
const ShortFilm = require('../model/short_film_model');
const Series = require('../model/series_model');
const SeasonEpisode = require('../model/season_episode_model');
const Season = require('../model/season_model');


// Create a recent search
exports.createRecentSearch = async (req, res) => {
    try {
        const { user_id, type, type_id } = req.body;

        const existingSearch = await RecentSearch.findOne({
            where: { user_id, type, type_id }
        });
        if (existingSearch) {
            await existingSearch.update({ updatedAt: new Date() });
            return res.status(200).json({
                status: true,
                msg: "Recent search updated",
                data: existingSearch
            });
        }

        const search = await RecentSearch.create({ user_id, type, type_id });

        return res.status(201).json({
            status: true,
            msg: "Recent search added",
            data: search
        });

    } catch (error) {
        console.error("Error creating recent search:", error);
        res.status(500).json({ status: false, msg: "Internal server error" });
    }
};

// Get all recent searches for a user with type_id details
exports.getRecentSearches = async (req, res) => {
    try {
        const { user_id, type, type_id } = req.query;

        if (!user_id) {
            return res.status(400).json({
                status: false,
                message: "user_id is required"
            });
        }

        const whereClause = { user_id };

        if (type) whereClause.type = type;
        if (type_id) whereClause.type_id = type_id;

        const searches = await RecentSearch.findAll({
            where: whereClause,
            order: [['updatedAt', 'DESC']],
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
            ]
        });

        // Fetch related details based on type
        const enrichedSearches = await Promise.all(searches.map(async (search) => {
            let relatedData = null;

            switch (search.type) {
                case 'movie':
                    relatedData = await Movie.findByPk(search.type_id);
                    break;
                case 'shortfilm':
                    relatedData = await ShortFilm.findByPk(search.type_id);
                    break;
                case 'series':
                    relatedData = await Series.findByPk(search.type_id);
                    break;
                case 'season_episode':
                    relatedData = await SeasonEpisode.findByPk(search.type_id);
                    break;
                case 'season':
                    relatedData = await Season.findByPk(search.type_id);
                    break;
            }

            return {
                ...search.toJSON(),
                details: relatedData
            };
        }));

        return res.status(200).json({
            status: true,
            message: "Recent searches fetched successfully",
            data: enrichedSearches
        });

    } catch (error) {
        console.error("Error fetching recent searches:", error);
        res.status(500).json({ status: false, msg: "Internal server error" });
    }
};