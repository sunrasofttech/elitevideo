const Season = require('../model/season_model');
const Series = require('../model/series_model');
const SeasonEpisodeModel = require('../model/season_episode_model');
const { Op } = require('sequelize');

exports.createSeason = async (req, res) => {
  try {
    const { season_name, series_id,status,released_date,show_type} = req.body;

    if (!season_name || !series_id) {
      return res.status(400).json({ status: false, message: "Both 'season_name' and 'series_id' are required", data: null });
    }

    const existing = await Season.findOne({ where: { season_name, series_id } });
    if (existing) {
      return res.status(400).json({ status: false, message: "Season with this season_name already exists for the given series", data: null });
    }

    // Create season
    const season = await Season.create({ season_name, series_id,status,released_date,show_type });
    res.status(201).json({ status: true, message: "Season created successfully", data: season });

  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to create season", data: err.message });
  }
};


exports.createMultipleSeasons = async (req, res) => {
  try {
    const seasons = req.body.seasons;

    if (!Array.isArray(seasons) || seasons.length === 0) {
      return res.status(400).json({ status: false, message: "Seasons array is required", data: null });
    }

    const validSeasons = [];
    const skippedSeasons = [];

    for (const season of seasons) {
      const { season_name, series_id, status, released_date,show_type } = season;

      if (!season_name || !series_id) {
        skippedSeasons.push({ season, reason: "Missing season_name or series_id" });
        continue;
      }

      const exists = await Season.findOne({ where: { season_name, series_id } });
      if (exists) {
        skippedSeasons.push({ season, reason: "Duplicate season_name for the given series" });
        continue;
      }

      validSeasons.push({ season_name, series_id, status, released_date,show_type });
    }

    const createdSeasons = await Season.bulkCreate(validSeasons);

    res.status(201).json({
      status: true,
      message: `${createdSeasons.length} seasons created successfully`,
      data: {
        created: createdSeasons,
        skipped: skippedSeasons
      }
    });

  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to create multiple seasons", data: err.message });
  }
};


exports.getAllSeasons = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = search
      ? {
          season_name: {
            [require('sequelize').Op.like]: `%${search}%`,
          }
        }
      : {};

    const { count, rows: seasons } = await Season.findAndCountAll({
      where: whereCondition,
      include: {
        model: Series,
        as: 'series',
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const result = await Promise.all(
      seasons.map(async (season) => {
        const episodes = await SeasonEpisodeModel.findAll({
          where: { season_id: season.id },
          order: [['createdAt', 'DESC']],
        });

        return {
          ...season.toJSON(),
          episodes,
        };
      })
    );

    res.status(200).json({
      status: true,
      message: "All seasons fetched",
      data: result,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching seasons", data: err.message });
  }
};


exports.getSeasonById = async (req, res) => {
  try {
    const season = await Season.findByPk(req.params.id, {
      include: {
        model: Series,
        as: 'series',
      },
    });

    if (!season) {
      return res.status(404).json({ status: false, message: "Season not found", data: null });
    }

    const episodes = await SeasonEpisodeModel.findAll({
      where: { season_id: season.id },
      order: [['createdAt', 'DESC']],
    });

    const result = {
      ...season.toJSON(),
      episodes,
    };

    res.status(200).json({ status: true, message: "Season fetched", data: result });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching season", data: err.message });
  }
};


exports.updateSeason = async (req, res) => {
  try {
    const updated = await Season.update(req.body, { where: { id: req.params.id } });

    if (updated[0] === 0) {
      return res.status(404).json({ status: false, message: "Season not found", data: null });
    }

    const season = await Season.findByPk(req.params.id);
    res.status(200).json({ status: true, message: "Season updated", data: season });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to update season", data: err.message });
  }
};

exports.deleteSeason = async (req, res) => {
  try {
    const deleted = await Season.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ status: false, message: "Season not found", data: null });
    }

    res.status(200).json({ status: true, message: "Season deleted", data: null });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to delete season", data: err.message });
  }
};

exports.getSeasonsBySeriesId = async (req, res) => {
  try {
    const { series_id } = req.params;

    const seasons = await Season.findAll({
      where: { series_id },
      include: {
        model: Series,
        as: 'series',
      },
      order: [['createdAt', 'DESC']],
    });

    if (seasons.length === 0) {
      return res.status(404).json({ status: false, message: 'No seasons found for this series', data: [] });
    }

    res.status(200).json({ status: true, message: 'Seasons fetched successfully', data: seasons });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Error fetching seasons', data: err.message });
  }
};