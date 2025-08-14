const { Op } = require('sequelize');
const MovieModel = require('../model/movie_model');
const ShortFilmModel = require('../model/short_film_model');
const SeriesModel = require('../model/series_model');
const SeasonEpisodeModel = require('../model/season_episode_model');
const SeasonModel = require('../model/season_model');
exports.searchAllContent = async (req, res) => {
    try {
        const { keyword } = req.query;

        const movieWhere = keyword ? { movie_name: { [Op.like]: `%${keyword}%` } } : {};
        const shortFilmWhere = keyword ? { short_film_title: { [Op.like]: `%${keyword}%` } } : {};
        const seriesWhere = keyword ? { series_name: { [Op.like]: `%${keyword}%` } } : {};
        const seasonEpisodeWhere = keyword ? { episode_name: { [Op.like]: `%${keyword}%` } } : {};
        const seasonWhere = keyword ? { season_name: { [Op.like]: `%${keyword}%` } } : {};

        const [movies, shortfilms, series, seasonepisode, season] = await Promise.all([
            MovieModel.findAll({ where: movieWhere }),
            ShortFilmModel.findAll({ where: shortFilmWhere }),
            SeriesModel.findAll({ where: seriesWhere }),
            SeasonEpisodeModel.findAll({ where: seasonEpisodeWhere }),
            SeasonModel.findAll({ where: seasonWhere })
        ]);

        return res.status(200).json({
            status: true,
            message: keyword 
                ? "Search results fetched successfully"
                : "All content fetched successfully",
            data: { movies, shortfilms, series, seasonepisode, season }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Search failed",
            data: error.message,
        });
    }
};
