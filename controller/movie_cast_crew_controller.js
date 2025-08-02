const CastCrew = require('../model/movie_cast_crew_model');
const Movie = require('../model/movie_model');
const { Op } = require('sequelize'); // Import Op for like queries

exports.addCastCrew = async (req, res) => {
    try {
        const data = {
            ...req.body,
            profile_img: req.file ? req.file.location : null
        };

        const castCrew = await CastCrew.create(data);
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
        if (req.query.movie_id) {
            filters.movie_id = req.query.movie_id;
        }

        const { count, rows } = await CastCrew.findAndCountAll({
            where: filters,
            include: [{ model: Movie, as: 'movie' }],
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
        const item = await CastCrew.findByPk(id, {
            include: [{ model: Movie, as: 'movie' }]
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

exports.getCastCrewByMovieId = async (req, res) => {
    try {
        const { movieId } = req.params;

        const castCrewList = await CastCrew.findAll({
            where: { movie_id: movieId },
            include: [{ model: Movie, as: 'movie' }]
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
            ...(req.file && { profile_img: req.file.location })
        };

        const [updated] = await CastCrew.update(updateData, { where: { id } });

        if (!updated) {
            return res.status(404).json({
                status: false,
                message: 'Cast/Crew not found'
            });
        }

        const updatedItem = await CastCrew.findByPk(id);
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
        const deleted = await CastCrew.destroy({ where: { id } });

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
