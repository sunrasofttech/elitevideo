const ChoosenForUMusic = require('../model/choose_for_u_music_model');
const MusicModel = require('../model/music_model');
const UserModel = require('../model/user_model');

// POST - Add new record
exports.createChoosenForUMusic = async (req, res) => {
    try {
        const { user_id, music_id } = req.body;

        if (!user_id || !music_id) {
            return res.status(400).json({
                status: false,
                message: "user_id and music_id are required",
                data: null
            });
        }

        const newEntry = await ChoosenForUMusic.create({
            user_id,
            music_id
        });

        return res.status(201).json({
            status: true,
            message: "Record created successfully",
            data: newEntry
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};

// GET - Filter by user_id
exports.getChoosenForUMusic = async (req, res) => {
    try {
        const { user_id } = req.query;

        const whereClause = {};
        if (user_id) {
            whereClause.user_id = user_id;
        }

        const records = await ChoosenForUMusic.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            include: [
                // { model: UserModel, as: 'user' },
                { model: MusicModel, as: 'music' }
            ]
        });

        if (!records.length) {
            return res.status(404).json({
                status: false,
                message: "No records found",
                data: null
            });
        }

        return res.status(200).json({
            status: true,
            message: "Records fetched successfully",
            data: records
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};
