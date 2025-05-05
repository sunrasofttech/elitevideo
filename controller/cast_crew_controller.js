const CastCrew = require('../model/cast_crew_model');
const Movie = require('../model/movie_model');

exports.addCastCrew = async (req, res) => {
    try {
        const data = {
            ...req.body,
            profile_img: req.file ? req.file.path : null
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
        const all = await CastCrew.findAll({
            include: [{ model: Movie, as: 'movie' }]
        });
        res.json({
            status: true,
            message: 'Cast/Crew fetched successfully',
            data: all
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

exports.updateCastCrew = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = {
            ...req.body,
            ...(req.file && { profile_img: req.file.path })
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
