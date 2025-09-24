const SeriesCastCrewModel = require('../model/series_cast_crew_model');
const Series = require('../model/series_model');
const { Op } = require('sequelize');

exports.addCastCrew = async (req, res) => {
    try {
        const data = {
            ...req.body,
            profile_img: req.file ? req.file.path : null
        };

        const castCrew = await SeriesCastCrewModel.create(data);
        res.status(201).json({
            status: true,
            message: 'Cast/Crew added successfully',
            data: castCrew
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to add Cast/Crew',
            data: err.message
        });
    }
};

exports.getAllCastCrew = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const filters = {};

        // Filter by name (LIKE query)
        if (req.query.name) {
            filters.name = {
                [Op.like]: `%${req.query.name}%`
            };
        }

        // Filter by movie_id (Exact match)
        if (req.query.series_id) {
            filters.series_id = req.query.series_id;
        }

        if (req.query.show_type) {
            filters.show_type = req.query.show_type;
        }
        const { count, rows } = await SeriesCastCrewModel.findAndCountAll({
            where: filters,
            include: [{ model: Series, as: 'series' }],
            limit,
            offset
        });

        res.json({
            status: true,
            message: 'Cast/Crew fetched successfully',
            data: rows,
            pagination: {
                totalItems: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                perPage: limit
            }
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch Cast/Crew',
            data: err.message
        });
    }
};
exports.getCastCrewById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await SeriesCastCrewModel.findByPk(id, {
            include: [{ model: Series, as: 'series' }]
        });
        if (!item) {
            return res.status(404).json({
                status: false,
                message: 'Cast/Crew not found'
            });
        }
        res.json({
            status: true,
            message: 'Cast/Crew fetched successfully',
            data: item
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch Cast/Crew',
            data: err.message
        });
    }
};

exports.getCastCrewBySeriesId = async (req, res) => {
    try {
        const { seriesId } = req.params;

        const castCrewList = await SeriesCastCrewModel.findAll({
            where: { series_id: seriesId },
            include: [{ model: Series, as: 'series' }]
        });

        res.json({
            status: true,
            message: 'Cast/Crew fetched successfully',
            data: castCrewList
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to fetch Cast/Crew by Movie ID',
            data: err.message
        });
    }
};


exports.updateCastCrew = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = {
            ...req.body,
            ...(req.file && { profile_img: req.file.path })
        };

        const [updated] = await SeriesCastCrewModel.update(updateData, { where: { id } });

        if (!updated) {
            return res.status(404).json({
                status: false,
                message: 'Cast/Crew not found'
            });
        }

        const updatedItem = await SeriesCastCrewModel.findByPk(id);
        res.json({
            status: true,
            message: 'Cast/Crew updated successfully',
            data: updatedItem
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to update Cast/Crew',
            data: err.message
        });
    }
};

exports.deleteCastCrew = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SeriesCastCrewModel.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({
                status: false,
                message: 'Cast/Crew not found'
            });
        }

        res.json({
            status: true,
            message: 'Cast/Crew deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Failed to delete Cast/Crew',
            data: err.message
        });
    }
};
