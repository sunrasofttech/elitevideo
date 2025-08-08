const AdminController = require('../controller/admin_controller');
const express = require('express');
const upload = require('../utils/uploadToSpace');
const Authenticate = require('../middleware/jwt_middleware');

const router = express.Router();
  
  router.post('/signup', AdminController.signUp);
  router.post('/login', AdminController.login);
  router.put('/:id',Authenticate,upload.single('profile_img'), AdminController.editAdmin);
  router.post('/subadmins',Authenticate, AdminController.getAllSubAdmins);
  router.delete('/:id',Authenticate, AdminController.deleteAdmin);
  router.post('/:id',Authenticate, AdminController.getAdminById);
  router.put('/:id/change-password',Authenticate, AdminController.changePassword);
  
module.exports = router;
