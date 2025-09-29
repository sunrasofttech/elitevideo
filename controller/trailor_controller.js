const Trailor = require('../model/trailor_model');
const MovieLanguage = require('../model/movie_language_model');
const MovieCategory = require('../model/movie_category_model');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// ➕ Add Trailor
exports.addTrailor = async (req, res) => {
    try {
        const { movie_name } = req.body;
        const existing = await Trailor.findOne({ where: { movie_name } });
        if (existing) {
            return res.status(400).json({
                status: false,
                message: 'Trailor with this name already exists',
            });
        }

        const files = req.files;

        const trailorData = {
            ...req.body,
            cover_img: files?.cover_img ? files.cover_img[0].path : null,
            poster_img: files?.poster_img ? files.poster_img[0].path : null,
            trailor_video: files?.trailor_video ? files.trailor_video[0].path : null,
        };

        const trailor = await Trailor.create(trailorData);

        res.status(201).json({
            status: true,
            message: "Trailor created successfully",
            data: trailor,
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Failed to create trailor",
            error: err.message,
        });
    }
};

// ✏️ Update Trailor
exports.updateTrailor = async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files;

        const updateData = {
            ...req.body,
            ...(files?.cover_img && { cover_img: files.cover_img[0].path }),
            ...(files?.poster_img && { poster_img: files.poster_img[0].path }),
            ...(files?.trailor_video && { trailor_video: files.trailor_video[0].path }),
        };

        const [updated] = await Trailor.update(updateData, { where: { id } });

        if (!updated) {
            return res.status(404).json({
                status: false,
                message: 'Trailor not found',
            });
        }

        const updatedTrailor = await Trailor.findByPk(id);
        res.json({
            status: true,
            message: "Trailor updated successfully",
            data: updatedTrailor,
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Failed to update trailor",
            error: err.message,
        });
    }
};

// 📜 Get All Trailors
exports.getAllTrailors = async (req, res) => {
    try {
        const { page = 1, limit = 10, movie_name, language_id, category_id } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (movie_name) whereClause.movie_name = { [Op.like]: `%${movie_name}%` };
        if (language_id) whereClause.movie_language = language_id;
        if (category_id) whereClause.movie_category = category_id;

        const { count, rows } = await Trailor.findAndCountAll({
            where: whereClause,
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: MovieCategory, as: 'category' },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
        });

        res.json({
            status: true,
            message: "Trailors fetched successfully",
            data: {
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit),
                trailors: rows,
            },
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Failed to fetch trailors",
            error: err.message,
        });
    }
};

// 🎬 Get Trailor By ID
exports.getTrailorById = async (req, res) => {
    try {
        const { id } = req.params;
        const trailor = await Trailor.findByPk(id, {
            include: [
                { model: MovieLanguage, as: 'language' },
                { model: MovieCategory, as: 'category' },
            ]
        });

        if (!trailor) {
            return res.status(404).json({
                status: false,
                message: 'Trailor not found',
            });
        }

        res.json({
            status: true,
            message: "Trailor fetched successfully",
            data: trailor,
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Failed to fetch trailor",
            error: err.message,
        });
    }
};

// ❌ Delete Trailors
exports.deleteTrailors = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Please provide an array of trailor IDs",
            });
        }

        const deleted = await Trailor.destroy({
            where: { id: { [Op.in]: ids } }
        });

        if (deleted === 0) {
            return res.status(404).json({
                status: false,
                message: "No trailors found to delete",
            });
        }

        res.json({
            status: true,
            message: `${deleted} trailor(s) deleted successfully`,
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: "Failed to delete trailors",
            error: err.message,
        });
    }
};
