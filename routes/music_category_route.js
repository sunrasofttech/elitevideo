const express = require('express');
const router = express.Router();
const musicCategoryController = require('../controller/music_category_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/',upload.single('cover_img'),Authenticate, musicCategoryController.createCategory);
router.post('/get-all',Authenticate, musicCategoryController.getAllCategories);
router.post('/:id',Authenticate, musicCategoryController.getCategoryById);
router.put('/:id',upload.single('cover_img'),Authenticate,musicCategoryController.updateCategory);
router.delete('/:id',Authenticate, musicCategoryController.deleteCategory);

module.exports = router;
