const MusicModel = require('../model/music_model');

exports.createMusic = async (req, res) => {
  try {
    const { song_title, song_url, description, watched_count, artist_name } = req.body;

    const coverImg = req.files?.cover_img?.[0]?.path;
    const songFile = req.files?.song_file?.[0]?.path;

    const newMusic = await MusicModel.create({
      cover_img: coverImg,
      song_title,
      song_url,
      description,
      watched_count,
      artist_name,
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
    const music = await MusicModel.findAll();
    return res.status(200).json({
      status: true,
      message: 'All music fetched successfully',
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

exports.getMusicById = async (req, res) => {
  try {
    const music = await MusicModel.findByPk(req.params.id);
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
        artist_name
      } = req.body;
  
      const coverImg = req.files?.cover_img?.[0]?.path || music.cover_img;
      const songFile = req.files?.song_file?.[0]?.path || music.song_file;
  
      await music.update({
        song_title,
        song_url,
        description,
        watched_count,
        artist_name,
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
