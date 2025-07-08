const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const musicController = require('../controller/music_controller');

router.post(
  '/',
  upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'song_file', maxCount: 1 }
  ]),
  musicController.createMusic
);

router.post('/get-all', musicController.getAllMusic);

router.post('/:id', musicController.getMusicById);
router.post('/category/:categoryId',musicController.getMusicByCategoryId);
router.post('/popular', musicController.getPopularMusic);
router.post('/artist/:artistName', musicController.getMusicByArtistName);


router.put(
    '/:id',
    upload.fields([
      { name: 'cover_img', maxCount: 1 },
      { name: 'song_file', maxCount: 1 }
    ]),
    musicController.updateMusic
  );

router.delete('/:id', musicController.deleteMusic);

module.exports = router;
