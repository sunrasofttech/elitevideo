// utils/uploadToSpace.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./s3');

const uploadToSpace = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bigcinema',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, {
        'Content-Disposition': 'inline',
      });
    },
    key: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `movies/${fileName}`);
    }
  })
});

module.exports = uploadToSpace;
