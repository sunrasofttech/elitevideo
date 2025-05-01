const Genre = require('../model/genre_model');

// Create
exports.createGenre = async (req, res) => {
  try {
    const { name, status } = req.body;
    const cover_img = req.file ? req.file.path : null;

    const genre = await Genre.create({ name, status, cover_img });

    res.status(201).json({
      status: true,
      message: 'Genre created successfully',
      data: genre,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to create genre',
      data: err.message,
    });
  }
};

// Update
exports.updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const cover_img = req.file ? req.file.path : null;

    const genre = await Genre.findByPk(id);
    if (!genre) {
      return res.status(404).json({
        status: false,
        message: 'Genre not found',
        data: null,
      });
    }

    genre.name = name || genre.name;
    genre.status = status !== undefined ? status : genre.status;
    if (cover_img) genre.cover_img = cover_img;

    await genre.save();

    res.status(200).json({
      status: true,
      message: 'Genre updated successfully',
      data: genre,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to update genre',
      data: err.message,
    });
  }
};

// Get All
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();

    res.status(200).json({
      status: true,
      message: 'Genres fetched successfully',
      data: genres,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch genres',
      data: err.message,
    });
  }
};

// Delete
exports.deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Genre.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: 'Genre not found',
        data: null,
      });
    }

    res.status(200).json({
      status: true,
      message: 'Genre deleted successfully',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete genre',
      data: err.message,
    });
  }
};
