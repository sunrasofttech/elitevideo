const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment_history_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/',Authenticate, paymentController.createPayment);
router.post('/get-all',Authenticate, paymentController.getAllPayments);
router.post('/:id',Authenticate, paymentController.getPaymentById);
router.put('/:id',Authenticate,paymentController.updatePayment);
router.delete('/:id',Authenticate, paymentController.deletePayment);

module.exports = router;
