const express = require("express");
const router = express.Router();
const razorpayOrderController = require("../controller/order_controller");

router.post("/create", razorpayOrderController.createOrder);

module.exports = router;
