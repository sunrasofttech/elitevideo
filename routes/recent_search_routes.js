const express = require('express');
const { body, param } = require('express-validator');
const { createRecentSearch, getRecentSearches } = require('../controller/recent_search_controller');
const Authenticate = require('../middleware/jwt_middleware');


const router = express.Router();

router.post(
    '/',Authenticate, createRecentSearch
);

router.get(
    '/',Authenticate, getRecentSearches
);

module.exports = router;
