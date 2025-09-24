const express = require('express');
const router = express.Router();
const upload = require('../utils/upload'); 
const userController = require('../controller/user_controller');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

router.post('/change-password', userController.changePassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/logout',userController.logoutDevice);

router.post('/', adminAuthenticate,userController.getAllUsers);
router.post('/:id',Authenticate, userController.getUserById);
router.put('/admin/:id',upload.single('profile_picture'),adminAuthenticate, userController.updateUser);
router.put('/:id',upload.single('profile_picture'),Authenticate, userController.updateUser);
router.delete('/:id',adminAuthenticate, userController.deleteUser);

module.exports = router;
