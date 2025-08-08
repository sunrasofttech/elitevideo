const express = require("express");
const router = express.Router();
const razorpayOrderController = require("../controller/order_controller");
const Authenticate = require('../middleware/jwt_middleware');
// const adminAuthenticate = require('../middleware/admin_auth');


router.post("/create",Authenticate,razorpayOrderController.createOrder);

module.exports = router;
