const AdminController = require('../controller/admin_controller');
const express = require('express');
const upload = require('../utils/uploadToSpace');
// const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

const router = express.Router();
  
  router.post('/signup', AdminController.signUp);
  router.post('/login', AdminController.login);
  router.put('/:id',adminAuthenticate,upload.single('profile_img'), AdminController.editAdmin);
  router.post('/subadmins',adminAuthenticate, AdminController.getAllSubAdmins);
  router.delete('/:id',adminAuthenticate, AdminController.deleteAdmin);
  router.post('/:id',adminAuthenticate, AdminController.getAdminById);
  router.put('/:id/change-password',adminAuthenticate, AdminController.changePassword);
  
module.exports = router;
