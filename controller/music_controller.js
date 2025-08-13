const MusicModel = require('../model/music_model');
const { Op } = require('sequelize');
const MusicCategoryModel = require('../model/music_categories_model');
const MusicArtistModel = require('../model/music_artist_model');
const LanguageModel = require('../model/movie_language_model');
exports.createMusic = async (req, res) => {
    try {
        const { song_title, song_url, description, watched_count, artist_name, category_id, status, is_popular, artist_id, language_id } = req.body;

        const coverImg = req.files?.cover_img?.[0]?.location;
        const songFile = req.files?.song_file?.[0]?.location;

        const newMusic = await MusicModel.create({
            cover_img: coverImg,
            song_title,
            song_url,
            description,
            watched_count,
            artist_name,
            category_id,
            artist_id,
            language_id,
            status,
            is_popular,
            song_file: songFile
        });

        return res.status(201).json({
            status: true,
            message: 'Music uploaded successfully',
            data: newMusic,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null,
        });
    }
};

exports.getAllMusic = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category_id, is_popular } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const whereCondition = {};

        // If search by song title
        if (search) {
            whereCondition.song_title = {
                [Op.like]: `%${search}%`,
            };
        }

        // If filter by category ID
        if (category_id) {
            whereCondition.category_id = category_id;
        }
        if (is_popular !== undefined) {
            whereCondition.is_popular = (is_popular === 'true');
        }
        const { count, rows } = await MusicModel.findAndCountAll({
            where: whereCondition,
            offset: offset,
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']],
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
            ]
        });

        return res.status(200).json({
            status: true,
            message: 'Music fetched successfully',
            data: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                items: rows,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null,
        });
    }
};

exports.getMusicById = async (req, res) => {
    try {
        const music = await MusicModel.findByPk(req.params.id, {
            include: [{
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
            ]
        });
        if (!music) {
            return res.status(404).json({
                status: false,
                message: 'Music not found',
                data: null,
            });
        }
        return res.status(200).json({
            status: true,
            message: 'Music fetched successfully',
            data: music,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null,
        });
    }
};

exports.getMusicByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const musicList = await MusicModel.findAll({
            where: { category_id: categoryId },
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            status: true,
            message: 'Music fetched by category ID successfully',
            data: musicList,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null,
        });
    }
};

exports.getPopularMusic = async (req, res) => {
    try {
        const popularMusic = await MusicModel.findAll({
            order: [['watched_count', 'DESC']],
            include: [{
                model: MusicCategoryModel,
                as: 'category',
            },
            {
                model: MusicArtistModel,
                as: 'artist'
            },
         {
                    model:LanguageModel,
                    as:'language'
                }],
        });

        return res.status(200).json({
            status: true,
            message: 'Popular music fetched successfully',
            data: popularMusic,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

exports.getMusicByArtistName = async (req, res) => {
    try {
        const { artistName } = req.params;

        const musicList = await MusicModel.findAll({
            where: {
                artist_name: {
                    [Op.like]: `%${artistName}%`
                }
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: MusicCategoryModel,
                as: 'category'
            },
            {
                model: MusicArtistModel,
                as: 'artist'
            },
             {
                    model:LanguageModel,
                    as:'language'
                }
            ]
        });

        return res.status(200).json({
            status: true,
            message: `Music fetched successfully for artist: ${artistName}`,
            data: musicList,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null,
        });
    }
};

exports.updateMusic = async (req, res) => {
    try {
        const { id } = req.params;
        const music = await MusicModel.findByPk(id);

        if (!music) {
            return res.status(404).json({
                status: false,
                message: 'Music not found',
                data: null,
            });
        }

        const {
            song_title,
            song_url,
            description,
            watched_count,
            artist_name,
            category_id,
            artist_id,
            language_id,
            is_popular,
            status,
        } = req.body;

        const coverImg = req.files?.cover_img?.[0]?.location || music.cover_img;
        const songFile = req.files?.song_file?.[0]?.location || music.song_file;

        await music.update({
            song_title,
            song_url,
            description,
            watched_count,
            artist_name,
            category_id,
            artist_id,
            language_id,
            is_popular,
            status,
            cover_img: coverImg,
            song_file: songFile,
        });

        return res.status(200).json({
            status: true,
            message: 'Music updated successfully',
            data: music,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null,
        });
    }
};


exports.deleteMusic = async (req, res) => {
    try {
        const music = await MusicModel.findByPk(req.params.id);
        if (!music) {
            return res.status(404).json({
                status: false,
                message: 'Music not found',
                data: null,
            });
        }
        await music.destroy();
        return res.status(200).json({
            status: true,
            message: 'Music deleted successfully',
            data: null,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null,
        });
    }
};
