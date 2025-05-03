const MusicCategoryModel = require('../model/music_categories_model');

exports.createCategory = async (req, res) => {
    try {
      const { name } = req.body;
      const category = await MusicCategoryModel.create({ name });
      res.status(201).json({
        status: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to create category',
        data: error.message,
      });
    }
  };
  
  // Read All
  exports.getAllCategories = async (req, res) => {
    try {
      const categories = await MusicCategoryModel.findAll();
      res.status(200).json({
        status: true,
        message: 'Categories fetched successfully',
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to fetch categories',
        data: error.message,
      });
    }
  };
  
  // Read One
  exports.getCategoryById = async (req, res) => {
    try {
      const category = await MusicCategoryModel.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          status: false,
          message: 'Category not found',
          data: null,
        });
      }
      res.status(200).json({
        status: true,
        message: 'Category fetched successfully',
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to fetch category',
        data: error.message,
      });
    }
  };
  
  // Update
  exports.updateCategory = async (req, res) => {
    try {
      const { name } = req.body;
      const category = await MusicCategoryModel.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          status: false,
          message: 'Category not found',
          data: null,
        });
      }
  
      category.name = name || category.name;
      await category.save();
      res.status(200).json({
        status: true,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to update category',
        data: error.message,
      });
    }
  };
  
  // Delete
  exports.deleteCategory = async (req, res) => {
    try {
      const category = await MusicCategoryModel.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          status: false,
          message: 'Category not found',
          data: null,
        });
      }
  
      await category.destroy();
      res.status(200).json({
        status: true,
        message: 'Category deleted successfully',
        data: null,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Failed to delete category',
        data: error.message,
      });
    }
  };