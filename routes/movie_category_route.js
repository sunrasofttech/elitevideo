const express = require('express');
const router = express.Router();
const movieCategoryController = require('../controller/movie_category_controller');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/',upload.single('img'),Authenticate, movieCategoryController.createMovieCategory);
router.post('/get-all',Authenticate, movieCategoryController.getAllMovieCategories);
router.post('/:id',Authenticate, movieCategoryController.getMovieCategoryById);
router.put('/:id',upload.single('img'),Authenticate, movieCategoryController.updateMovieCategory);
router.delete('/:id',Authenticate, movieCategoryController.deleteMovieCategory);

module.exports = router;
