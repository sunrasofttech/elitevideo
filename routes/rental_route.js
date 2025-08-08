const express = require('express');
const router = express.Router();
const RentalController = require('../controller/rental_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/',Authenticate, RentalController.createRental);
router.post('/get-all',Authenticate, RentalController.getAllRentals);
router.post('/:id',Authenticate, RentalController.getRentalById);
router.post('/checkrental/api',Authenticate,RentalController.checkRentalExists);
router.put('/:id',Authenticate, RentalController.updateRental);
router.delete('/:id',Authenticate, RentalController.deleteRental);

module.exports = router;
