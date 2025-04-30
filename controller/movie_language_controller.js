const MovieLanguage = require('../model/movie_language_model');

exports.createMovieLanguage = async (req, res) => {
  try {
    const { name } = req.body;
    const cover_img = req.file ? req.file.path : null;

    const movieLang = await MovieLanguage.create({ name, cover_img });

    res.status(201).json({
      status: true,
      message: 'Movie language created successfully',
      data: movieLang,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to create movie language',
      data: err.message,
    });
  }
};

exports.updateMovieLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const cover_img = req.file ? req.file.path : null;

    const movieLang = await MovieLanguage.findByPk(id);

    if (!movieLang) {
      return res.status(404).json({
        status: false,
        message: 'Movie language not found',
        data: null,
      });
    }

    movieLang.name = name || movieLang.name;
    if (cover_img) movieLang.cover_img = cover_img;

    await movieLang.save();

    res.status(200).json({
      status: true,
      message: 'Movie language updated successfully',
      data: movieLang,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to update movie language',
      data: err.message,
    });
  }
};

// Get All
exports.getAllMovieLanguages = async (req, res) => {
  try {
    const languages = await MovieLanguage.findAll();

    res.status(200).json({
      status: true,
      message: 'Movie languages fetched successfully',
      data: languages,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch movie languages',
      data: err.message,
    });
  }
};

// Delete
exports.deleteMovieLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MovieLanguage.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Movie language not found',
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Movie language deleted successfully',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete movie language',
      data: err.message,
    });
  }
};
