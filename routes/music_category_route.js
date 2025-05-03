const express = require('express');
const router = express.Router();
const musicCategoryController = require('../controller/music_category_controller');

router.post('/', musicCategoryController.createCategory);
router.post('/get-all', musicCategoryController.getAllCategories);
router.post('/:id', musicCategoryController.getCategoryById);
router.put('/:id', musicCategoryController.updateCategory);
router.delete('/:id', musicCategoryController.deleteCategory);

module.exports = router;
