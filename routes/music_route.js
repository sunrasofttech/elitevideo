const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadToSpace');
const musicController = require('../controller/music_controller');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post(
  '/',
  upload.fields([
    { name: 'cover_img', maxCount: 1 },
    { name: 'song_file', maxCount: 1 }
  ]),
  adminAuthenticate,
  musicController.createMusic
);

router.post('/admin/get-all',adminAuthenticate, musicController.getAllMusic);
router.post('/get-all',Authenticate, musicController.getAllMusic);

router.post('/:id',Authenticate, musicController.getMusicById);
router.post('/category/:categoryId',Authenticate,musicController.getMusicByCategoryId);
router.post('/popular',Authenticate,musicController.getPopularMusic);
router.post('/artist/:artistName',Authenticate, musicController.getMusicByArtistName);


router.put(
    '/:id',
    upload.fields([
      { name: 'cover_img', maxCount: 1 },
      { name: 'song_file', maxCount: 1 }
    ]),
    adminAuthenticate,
    musicController.updateMusic
  );

router.delete('/:id',adminAuthenticate, musicController.deleteMusic);

module.exports = router;
