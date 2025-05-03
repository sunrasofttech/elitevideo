const MovieCategory = require('../model/movie_category_model');

// Create
exports.createMovieCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const existingCategory = await MovieCategory.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(409).json({
        status: false,
        message: 'Movie category with this name already exists',
      });
    }
    const category = await MovieCategory.create({ name, status });
    res.status(201).json({status:true,message:"Movie category created successfully.",category});
  } catch (error) {
    res.status(500).json({status:false, message: 'Failed to create movie category' });
  }
};

// Get All
exports.getAllMovieCategories = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      const { count, rows } = await MovieCategory.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });
  
      res.status(200).json({
        status: true,
        message: "Get movie categories successfully.",
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        categories: rows,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to fetch movie categories',
      });
    }
  };
  

// Get By ID
exports.getMovieCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await MovieCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({status:false, message: 'Movie category not found' });
    }
    res.status(200).json({status:true,message:"Get movies category sucessfully.",category});
  } catch (error) {
    res.status(500).json({status:false, message: 'Failed to fetch movie category'});
  }
};

// Update
exports.updateMovieCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
   
    const category = await MovieCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({status:false, message: 'Movie category not found' });
    }

    await category.update({ name, status });
    res.status(200).json({status:true,message:"Movie category updated successfully",category});
  } catch (error) {
    res.status(500).json({status:false, message: 'Failed to update movie category'});
  }
};

// Delete
exports.deleteMovieCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await MovieCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ status:false, message: 'Movie category not found' });
    }

    await category.destroy();
    res.status(200).json({ status:true,message: 'Movie category deleted successfully' });
  } catch (error) {
    res.status(500).json({status:false, message: 'Failed to delete movie category'});
  }
};
