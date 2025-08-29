const express = require('express');
const router = express.Router();
const playlistController = require('../controller/playlist_controller');

router.post('/create', playlistController.createPlaylist);

router.post('/add-song', playlistController.addSongToPlaylist);

router.get('/user/:user_id', playlistController.getUserPlaylists);

module.exports = router;
