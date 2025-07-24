const Razorpay = require("razorpay");
const Order = require("../model/order_model");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: currency || "INR",
    });

    const newOrder = await Order.create({
      orderId: order.id,
      amount,
      currency: currency || "INR",
      status: "created",
    });

    res.status(200).json({ status: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ status: false, message: "Order creation failed", error });
  }
};
