const express = require('express');
const router = express.Router();
const controller = require('../controller/live_tv_category_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/', upload.single('cover_img'),Authenticate, controller.createCategory);
router.post('/get-all',Authenticate, controller.getAllCategories);
router.post('/:id',Authenticate, controller.getCategoryById);
router.put('/:id',Authenticate,upload.single('cover_img'), controller.updateCategory);
router.delete('/:id',Authenticate, controller.deleteCategory);

module.exports = router;
