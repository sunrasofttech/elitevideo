const express = require('express');
const router = express.Router();
const controller = require('../controller/live_tv_category_controller');
const upload = require('../utils/uploadToSpace');

router.post('/', upload.single('cover_img'), controller.createCategory);
router.post('/get-all', controller.getAllCategories);
router.post('/:id', controller.getCategoryById);
router.put('/:id', upload.single('cover_img'), controller.updateCategory);
router.delete('/:id', controller.deleteCategory);

module.exports = router;
