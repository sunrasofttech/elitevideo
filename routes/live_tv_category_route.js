const express = require('express');
const router = express.Router();
const controller = require('../controller/live_tv_category_controller');
const upload = require('../utils/uploadToSpace');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/', upload.single('cover_img'),adminAuthenticate, controller.createCategory);
router.post('/get-all',adminAuthenticate, controller.getAllCategories);
router.post('/:id',adminAuthenticate, controller.getCategoryById);
router.put('/:id',adminAuthenticate,upload.single('cover_img'), controller.updateCategory);
router.delete('/:id',adminAuthenticate, controller.deleteCategory);

module.exports = router;
