const express = require('express');
const router = express.Router();
const Authenticate = require('../middleware/jwt_middleware');

const { getHighlightedContent } = require('../controller/highlighted_controller');

router.post('/',Authenticate, getHighlightedContent);

module.exports = router;
