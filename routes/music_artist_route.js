const express = require('express');
const upload = require('../utils/uploadToSpace');

const {
    createMusicArtist,
    getAllMusicArtists,
    getMusicArtistById,
    updateMusicArtist,
    deleteMusicArtist
} = require('../controller/music_artist_controller');

const router = express.Router();

router.post('/music-artist',upload.single('profile_img'), createMusicArtist);

router.get('/music-artist', getAllMusicArtists);

router.get('/music-artist/:id', getMusicArtistById);

router.put('/music-artist/:id',upload.single('profile_img'), updateMusicArtist);

router.delete('/music-artist/:id', deleteMusicArtist);

module.exports = router;
