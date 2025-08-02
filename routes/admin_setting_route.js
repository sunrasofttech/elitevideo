const express = require('express');
const router = express.Router();
const adminSettingController = require('../controller/admin_setting_controller');
const upload = require('../utils/uploadToSpace');

const multiUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'spash_screen_banner_1', maxCount: 1 },
  { name: 'spash_screen_banner_2', maxCount: 1 },
  { name: 'spash_screen_banner_3', maxCount: 1 },
]);

router.post('/get', adminSettingController.getAdminSetting);

router.post('/',multiUpload, adminSettingController.createOrUpdateAdminSetting);

router.delete('/', adminSettingController.deleteAdminSetting);

module.exports = router;