const express = require('express');
const router = express.Router();
const upload = require('../utils/upload'); 
const userController = require('../controller/user_controller');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

router.post('/change-password', userController.changePassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/logout',userController.logoutDevice);

router.post('/', userController.getAllUsers);
router.post('/:id', userController.getUserById);
router.put('/:id',upload.single('profile_picture'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
