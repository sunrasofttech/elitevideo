const ChoosenForUMusic = require('../model/choose_for_u_music_model');
const MusicModel = require('../model/music_model');
const UserModel = require('../model/user_model');
const MusicCategoryModel = require('../model/music_categories_model');
const MusicArtistModel = require('../model/music_artist_model');
const LanguageModel = require('../model/movie_language_model');

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

        const existingRecord = await ChoosenForUMusic.findOne({
            where: { user_id, music_id }
        });

        if (existingRecord) {
            return res.status(409).json({
                status: false,
                message: "Record already exists",
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
            attributes: [],
            include: [
                {
                    model: MusicModel,
                    as: 'music',
                   
                    attributes: [
                        'cover_img',
                        'category_id',
                        'artist_id',
                        'language_id',
                        'song_title',
                        'song_url',
                        'song_file',
                        'description',
                        'watched_count',
                        'status',
                        'artist_name',
                        'is_popular',
                        'createdAt',
                        'updatedAt'
                    ],
                     include: [
                        {
                            model: MusicCategoryModel,
                            as: 'category'
                        },
                        {
                            model: MusicArtistModel,
                            as: 'artist'
                        },
                        {
                            model: LanguageModel,
                            as: 'language'
                        }
                    ],
                }
            ]
        });

        if (!records.length) {
            return res.status(404).json({
                status: false,
                message: "No records found",
                data: null
            });
        }

        // Flatten music object so fields are top-level
        const flattenedData = records.map(record => record.music);

        return res.status(200).json({
            status: true,
            message: "Records fetched successfully",
            data: flattenedData
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};
