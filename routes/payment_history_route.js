const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment_history_controller');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');


router.post('/',Authenticate, paymentController.createPayment);
router.post('/get-all',adminAuthenticate, paymentController.getAllPayments);
router.post('/:id',adminAuthenticate, paymentController.getPaymentById);
router.put('/:id',adminAuthenticate,paymentController.updatePayment);
router.delete('/:id',adminAuthenticate, paymentController.deletePayment);

module.exports = router;
