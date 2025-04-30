const AdminController = require('../controller/admin_controller');
const express = require('express');


const router = express.Router();
  
  router.post('/signup', AdminController.signUp);
  router.post('/login', AdminController.login);
  router.put('/:id', AdminController.editAdmin);
  router.delete('/:id', AdminController.deleteAdmin);
  router.get('/:id', AdminController.getAdminById);
  router.put('/:id/change-password', AdminController.changePassword);
  
module.exports = router;
