const express = require('express');
const router = express.Router();
const adminSettingController = require('../controller/admin_setting_controller');
const upload = require('../utils/upload');

router.post('/get', adminSettingController.getAdminSetting);

router.post('/', upload.single('logo'), adminSettingController.createOrUpdateAdminSetting);

router.delete('/', adminSettingController.deleteAdminSetting);

module.exports = router;