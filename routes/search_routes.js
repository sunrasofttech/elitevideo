const express = require('express');
const router = express.Router();

const searchAllContent  = require('../controller/search_api_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/',Authenticate, searchAllContent.searchAllContent);

module.exports = router;
