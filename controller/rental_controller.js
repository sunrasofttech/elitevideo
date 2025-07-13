const RentalModel = require('../model/rental_model');
const MovieModel = require('../model/movie_model');
const SeriesModel = require('../model/series_model');
const UserModel = require('../model/user_model');
const ShortFilm = require('../model/short_film_model');
const { Op } = require('sequelize');

// Create rental
exports.createRental = async (req, res) => {
    try {
        const rental = await RentalModel.create(req.body);
        return res.status(201).json({
            status: true,
            message: "Rental created successfully",
            data: rental,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to create rental",
            data: error.message,
        });
    }
};

exports.getAllRentals = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, user_id } = req.query;
        const offset = (page - 1) * limit;

        const whereCondition = {};

        if (type === 'movie') {
            whereCondition.movie_id = { [Op.ne]: null };
        } else if (type === 'series') {
            whereCondition.series_id = { [Op.ne]: null };
        } else if (type === 'shortfilm') {
            whereCondition.shortfilm_id = { [Op.ne]: null };
        }

        if (user_id) {
            whereCondition.user_id = user_id;
        }

        const rentals = await RentalModel.findAndCountAll({
            where: whereCondition,
            limit: parseInt(limit),
            offset,
            include: [
                { model: MovieModel, as: 'movie' },
                { model: SeriesModel, as: 'series' },
                { model: UserModel, as: 'user' },
                { model: ShortFilm, as:'shortfilm'}
            ],
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            status: true,
            message: "Rentals fetched successfully",
            data: {
                totalItems: rentals.count,
                totalPages: Math.ceil(rentals.count / limit),
                currentPage: parseInt(page),
                rentals: rentals.rows,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch rentals",
            data: error.message,
        });
    }
};



exports.getRentalById = async (req, res) => {
    try {
        const rental = await RentalModel.findByPk(req.params.id, {
            include: [
                { model: MovieModel, as: 'movie' },
                { model: SeriesModel, as: 'series' },
                { model: UserModel, as: 'user' },
            ],
        });

        if (!rental) {
            return res.status(404).json({
                status: false,
                message: "Rental not found",
                data: null,
            });
        }

        return res.status(200).json({
            status: true,
            message: "Rental fetched successfully",
            data: rental,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch rental",
            data: error.message,
        });
    }
};

// Update rental
exports.updateRental = async (req, res) => {
    try {
        const [updated] = await RentalModel.update(req.body, {
            where: { id: req.params.id },
        });

        if (!updated) {
            return res.status(404).json({
                status: false,
                message: "Rental not found",
                data: null,
            });
        }

        const updatedRental = await RentalModel.findByPk(req.params.id);
        return res.status(200).json({
            status: true,
            message: "Rental updated successfully",
            data: updatedRental,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to update rental",
            data: error.message,
        });
    }
};

// Delete rental
exports.deleteRental = async (req, res) => {
    try {
        const deleted = await RentalModel.destroy({
            where: { id: req.params.id },
        });

        if (!deleted) {
            return res.status(404).json({
                status: false,
                message: "Rental not found",
                data: null,
            });
        }

        return res.status(200).json({
            status: true,
            message: "Rental deleted successfully",
            data: null,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to delete rental",
            data: error.message,
        });
    }
};

exports.checkRentalExists = async (req, res) => {
    try {
        const { user_id, type_id, type } = req.query;

        if (!user_id || !type_id || !type) {
            return res.status(400).json({
                status: false,
                message: "user_id, type, and type_id are required",
            });
        }

        const whereCondition = { user_id };

        if (type === 'movie') {
            whereCondition.movie_id = type_id;
        } else if (type === 'series') {
            whereCondition.series_id = type_id;
        } else if (type === 'shortfilm') {
            whereCondition.shortfilm_id = type_id;
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid type. Allowed values are: movie, series, shortfilm",
            });
        }

        const rental = await RentalModel.findOne({
            where: whereCondition,
        });

        if (rental) {
            return res.status(200).json({
                status: true,
                message: "Rental exists",
                data: rental,
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Rental not found",
                data: null,
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to check rental",
            data: error.message,
        });
    }
};
