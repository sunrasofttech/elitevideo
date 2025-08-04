const express = require('express');
const router = express.Router();
const { getHighlightedContent } = require('../controller/highlighted_controller');

router.post('/', getHighlightedContent);

module.exports = router;
