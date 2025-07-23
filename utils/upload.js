const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/jpg',
    'text/csv',
    'application/vnd.android.package-archive',
    'video/mp4',
    'video/mkv',
    'video/webm',
    'audio/mpeg', 
    'audio/wav',
    'audio/aac',
    'audio/ogg',
    'audio/flac'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, CSV, APK, and video files (MP4, MKV, WEBM) are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4000 * 1024 * 1024 },
});

module.exports = upload;

// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// Configure dynamic storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let uploadPath = 'uploads/';

//     if (file.mimetype.startsWith('video/')) {
//       uploadPath = 'uploads/video/';
//     }

//     // Create folder if it doesn't exist
//     fs.mkdirSync(uploadPath, { recursive: true });

//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     'image/png',
//     'image/jpeg',
//     'image/svg+xml',
//     'image/jpg',
//     'text/csv',
//     'application/vnd.android.package-archive',
//     'video/mp4',
//     'video/mkv',
//     'video/webm',
//     'audio/mpeg', 
//     'audio/wav',
//     'audio/aac',
//     'audio/ogg',
//     'audio/flac'
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only images, CSV, APK, video, and audio files are allowed.'));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 1000 * 1024 * 1024 }, // 1000MB
// });

// module.exports = upload;
