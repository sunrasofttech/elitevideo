const MusicArtist = require('../model/music_artist_model');

// Create Music Artist
exports.createMusicArtist = async (req, res) => {
    try {
        const { artist_name } = req.body;
        const profile_img = req.file ? req.file.location : null;
        if (!artist_name) {
            return res.status(400).json({
                status: false,
                message: 'Artist name is required',
                data: null,
            });
        }

        const newArtist = await MusicArtist.create({ artist_name, profile_img });

        return res.status(201).json({
            status: true,
            message: 'Music artist created successfully',
            data: newArtist,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// Get All Music Artists
exports.getAllMusicArtists = async (req, res) => {
    try {
        const artists = await MusicArtist.findAll({ order: [['createdAt', 'DESC']] });
        return res.status(200).json({
            status: true,
            message: 'Music artists fetched successfully',
            data: artists,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// Get Single Music Artist
exports.getMusicArtistById = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await MusicArtist.findByPk(id);

        if (!artist) {
            return res.status(404).json({
                status: false,
                message: 'Music artist not found',
                data: null,
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Music artist fetched successfully',
            data: artist,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// Update Music Artist
exports.updateMusicArtist = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = { artist_name };
        if (profile_img) {
            updatedData.profile_img = profile_img;
        }
        const artist = await MusicArtist.findByPk(id);
        if (!artist) {
            return res.status(404).json({
                status: false,
                message: 'Music artist not found',
                data: null,
            });
        }

        await artist.update(updatedData);

        return res.status(200).json({
            status: true,
            message: 'Music artist updated successfully',
            data: artist,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// Delete Music Artist
exports.deleteMusicArtist = async (req, res) => {
    try {
        const { id } = req.params;

        const artist = await MusicArtist.findByPk(id);
        if (!artist) {
            return res.status(404).json({
                status: false,
                message: 'Music artist not found',
                data: null,
            });
        }

        await artist.destroy();

        return res.status(200).json({
            status: true,
            message: 'Music artist deleted successfully',
            data: null,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};
