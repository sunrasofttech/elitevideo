const express = require('express');
const router = express.Router();
const RentalController = require('../controller/rental_controller');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/',Authenticate, RentalController.createRental);
router.post('/get-all',adminAuthenticate, RentalController.getAllRentals);
router.post('/:id',adminAuthenticate, RentalController.getRentalById);
router.post('/checkrental/api',Authenticate,RentalController.checkRentalExists);
router.put('/:id',adminAuthenticate, RentalController.updateRental);
router.delete('/:id',adminAuthenticate, RentalController.deleteRental);

module.exports = router;
