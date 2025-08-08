const express = require('express');
const router = express.Router();
const musicCategoryController = require('../controller/music_category_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/',upload.single('cover_img'),adminAuthenticate, musicCategoryController.createCategory);

router.post('/admin/get-all',adminAuthenticate, musicCategoryController.getAllCategories);
router.post('/get-all',Authenticate, musicCategoryController.getAllCategories);
router.post('/:id',adminAuthenticate, musicCategoryController.getCategoryById);
router.put('/:id',upload.single('cover_img'),adminAuthenticate,musicCategoryController.updateCategory);
router.delete('/:id',adminAuthenticate, musicCategoryController.deleteCategory);

module.exports = router;
