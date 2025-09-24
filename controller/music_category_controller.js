const MusicCategoryModel = require('../model/music_categories_model');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const cover_img = req.file ? req.file.path : null;

    const category = await MusicCategoryModel.create({ name, cover_img });
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

exports.getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || ''; // ?search=xyz

    const whereClause = search
      ? {
          name: {
            [Op.like]: `%${search}%`
          }
        }
      : {};

    const { count, rows } = await MusicCategoryModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    res.status(200).json({
      status: true,
      message: 'Categories fetched successfully',
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
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

    if (req.file && category.cover_img) {
      const oldImgPath = path.join(__dirname, '../uploads', category.cover_img);
      if (fs.existsSync(oldImgPath)) {
        fs.unlinkSync(oldImgPath);
      }
    }

    // Update fields
    category.name = name || category.name;
    category.cover_img = req.file ? req.file.path : category.cover_img;

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