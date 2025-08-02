const AdminController = require('../controller/admin_controller');
const express = require('express');
const upload = require('../utils/uploadToSpace');

const router = express.Router();
  
  router.post('/signup', AdminController.signUp);
  router.post('/login', AdminController.login);
  router.put('/:id',upload.single('profile_img'), AdminController.editAdmin);
  router.post('/subadmins', AdminController.getAllSubAdmins);
  router.delete('/:id', AdminController.deleteAdmin);
  router.post('/:id', AdminController.getAdminById);
  router.put('/:id/change-password', AdminController.changePassword);
  
module.exports = router;
