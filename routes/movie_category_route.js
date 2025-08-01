const express = require('express');
const router = express.Router();
const movieCategoryController = require('../controller/movie_category_controller');
const upload = require('../utils/upload');

router.post('/',upload.single('img'), movieCategoryController.createMovieCategory);
router.post('/get-all', movieCategoryController.getAllMovieCategories);
router.post('/:id', movieCategoryController.getMovieCategoryById);
router.put('/:id',upload.single('img'), movieCategoryController.updateMovieCategory);
router.delete('/:id', movieCategoryController.deleteMovieCategory);

module.exports = router;
