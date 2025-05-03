const express = require('express');
const router = express.Router();
const movieCategoryController = require('../controller/movie_category_controller');

router.post('/', movieCategoryController.createMovieCategory);
router.post('/get-all', movieCategoryController.getAllMovieCategories);
router.post('/:id', movieCategoryController.getMovieCategoryById);
router.put('/:id', movieCategoryController.updateMovieCategory);
router.delete('/:id', movieCategoryController.deleteMovieCategory);

module.exports = router;
