const express = require('express');
const router = express.Router();
const playlistController = require('../controller/playlist_controller');

router.post('/create', playlistController.createPlaylist);

router.post('/add-song', playlistController.addSongToPlaylist);

router.get('/user/:user_id', playlistController.getUserPlaylists);

router.delete('/:playlist_id', playlistController.deletePlaylist);


module.exports = router;
