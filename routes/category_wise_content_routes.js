const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category_wise_content_controller');
 const Authenticate = require('../middleware/jwt_middleware');

router.get('/category-wise-content',Authenticate, categoryController.getCategoryWiseContent);

module.exports = router;
