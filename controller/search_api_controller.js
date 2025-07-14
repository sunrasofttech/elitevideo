const { Op } = require('sequelize');
const MovieModel = require('../model/movie_model');
const ShortFilmModel = require('../model/short_film_model');
const SeriesModel = require('../model/series_model');
const SeasonEpisodeModel = require('../model/season_episode_model');
const SeasonModel = require('../model/season_model');

exports.searchAllContent = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({
                status: false,
                message: "Search keyword is required",
            });
        }

        const [movies, shortfilms, series, seasonepisode,season] = await Promise.all([
            MovieModel.findAll({
                where: {
                    movie_name: { [Op.like]: `%${keyword}%` }
                }
            }),
            ShortFilmModel.findAll({
                where: {
                    short_film_title: { [Op.like]: `%${keyword}%` }
                }
            }),
            SeriesModel.findAll({
                where: {
                    series_name: { [Op.like]: `%${keyword}%` }
                }
            }),
            SeasonEpisodeModel.findAll({
                where: {
                    episode_name: { [Op.like]: `%${keyword}%` }
                }
            }),
            SeasonModel.findAll({
                where: {
                    season_name: { [Op.like]: `%${keyword}%` }
                }
            })
        ]);

        return res.status(200).json({
            status: true,
            message: "Search results fetched successfully",
            data: {
                movies,
                shortfilms,
                series,
                seasonepisode,
                season
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Search failed",
            data: error.message,
        });
    }
};
