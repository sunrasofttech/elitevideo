const express = require('express');
const router = express.Router();
const musicCategoryController = require('../controller/music_category_controller');
const upload = require('../utils/uploadToSpace');

router.post('/',upload.single('cover_img'), musicCategoryController.createCategory);
router.post('/get-all', musicCategoryController.getAllCategories);
router.post('/:id', musicCategoryController.getCategoryById);
router.put('/:id',upload.single('cover_img'),musicCategoryController.updateCategory);
router.delete('/:id', musicCategoryController.deleteCategory);

module.exports = router;
