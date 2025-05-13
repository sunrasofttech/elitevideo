const express = require('express');
const router = express.Router();
const RentalController = require('../controller/rental_controller');

router.post('/', RentalController.createRental);
router.post('/get-all', RentalController.getAllRentals);
router.post('/:id', RentalController.getRentalById);
router.put('/:id', RentalController.updateRental);
router.delete('/:id', RentalController.deleteRental);

module.exports = router;
