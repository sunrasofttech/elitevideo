const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment_history_controller');

router.post('/', paymentController.createPayment);
router.post('/get-all', paymentController.getAllPayments);
router.post('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
