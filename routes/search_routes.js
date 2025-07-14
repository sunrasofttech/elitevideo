const express = require('express');
const router = express.Router();

const searchAllContent  = require('../controller/search_api_controller');

router.post('/', searchAllContent.searchAllContent);

module.exports = router;
