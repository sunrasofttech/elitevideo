const express = require('express');
const router = express.Router();
const movieCategoryController = require('../controller/movie_category_controller');
const upload = require('../utils/uploadToSpace');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/',upload.single('img'),adminAuthenticate, movieCategoryController.createMovieCategory);
router.post('/get-all',adminAuthenticate, movieCategoryController.getAllMovieCategories);
router.post('/:id',adminAuthenticate, movieCategoryController.getMovieCategoryById);
router.put('/:id',upload.single('img'),adminAuthenticate, movieCategoryController.updateMovieCategory);
router.delete('/:id',adminAuthenticate, movieCategoryController.deleteMovieCategory);

module.exports = router;
