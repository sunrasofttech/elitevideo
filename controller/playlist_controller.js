const { PlaylistModel, PlaylistSong } = require('../model/music_playlist_model');
const MusicModel = require('../model/music_model');

exports.createPlaylist = async (req, res) => {
    try {
        const { user_id, name, description } = req.body;

        if (!user_id || !name) {
            return res.status(400).json({ status: false, message: "user_id and name required" });
        }
        const exists = await PlaylistModel.findOne({ where: { user_id, name } });
        if (exists) {
            return res.status(400).json({ status: false, message: "playlist already exists" });
        }

        const playlist = await PlaylistModel.create({ user_id, name, description });

        res.status(201).json({ status: true, message: "Playlist created", playlist });
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({ status: true, message: "Internal Server Error" });
    }
};

exports.addSongToPlaylist = async (req, res) => {
    try {
        const { playlist_id, song_id } = req.body;

        if (!playlist_id || !song_id) {
            return res.status(400).json({ status: false, message: "playlist_id and song_id required" });
        }

        const exists = await PlaylistSong.findOne({ where: { playlist_id, song_id } });
        if (exists) {
            return res.status(400).json({ status: false, message: "Song already exists in this playlist" });
        }

        await PlaylistSong.create({ playlist_id, song_id });

        res.json({ status: true, message: "Song added to playlist" });
    } catch (error) {
        console.error("Error adding song:", error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

exports.getUserPlaylists = async (req, res) => {
    try {
        const { user_id } = req.params;

        const playlists = await PlaylistModel.findAll({
            where: { user_id },
            include: [{ model: MusicModel, as: 'songs' }]
        });

        res.json({ status:true,message:"fetched playlist by user", playlists });
    } catch (error) {
        console.error("Error fetching playlists:", error);
        res.status(500).json({ success: 0, message: "Internal Server Error" });
    }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const { playlist_id } = req.params;

    if (!playlist_id) {
      return res.status(400).json({ status: false, message: "playlist_id required" });
    }

    const playlist = await PlaylistModel.findByPk(playlist_id);
    if (!playlist) {
      return res.status(404).json({ status: false, message: "Playlist not found" });
    }

    await playlist.destroy();

    res.json({ status: true, message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
