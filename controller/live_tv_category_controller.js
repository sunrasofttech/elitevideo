const LiveTvCategory = require('../model/live_tv_category_model');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

exports.createCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const cover_img = req.file ? req.file.location : null;

    const category = await LiveTvCategory.create({ name, status, cover_img });

    res.status(201).json({
      status: true,
      message: 'Live TV Category created successfully',
      data: category
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to create category',
      data: err.message
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const name = req.query.name || '';


    const { count, rows } = await LiveTvCategory.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${name}%` 
        }
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      status: true,
      message: 'Fetched categories successfully',
      data: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        categories: rows
      }
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch categories',
      data: err.message
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await LiveTvCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Category not found',
        data: null
      });
    }

    res.json({
      status: true,
      message: 'Fetched category successfully',
      data: category
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch category',
      data: err.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const category = await LiveTvCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Category not found',
        data: null
      });
    }

    if (req.file && category.cover_img) {
      fs.unlink(path.join(__dirname, '../uploads', category.cover_img), () => {});
    }

    await category.update({
      name,
      status,
      cover_img: req.file ? req.file.location : category.cover_img,
    });

    res.json({
      status: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to update category',
      data: err.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await LiveTvCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Category not found',
        data: null
      });
    }

    if (category.cover_img) {
      fs.unlink(path.join(__dirname, '../uploads', category.cover_img), () => {});
    }

    await category.destroy();

    res.json({
      status: true,
      message: 'Category deleted successfully',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete category',
      data: err.message
    });
  }
};
