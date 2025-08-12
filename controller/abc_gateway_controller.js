const moment = require('moment-timezone');
const { validationResult } = require('express-validator');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Import your models
const User = require('../model/user_model');
const Deposit = require('../models/Deposit');
const PaymentData = require('../model/payment_history_model');
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');


exports.getabcgatewayPaymentDetails = async (req, res) => {
    try {
        const {
            event_type,
            data
        } = req.body;

        if (event_type !== "PAYIN") {
            return res.status(200).json({
                status: false,
                msg: "Invalid event type",
            });
        }

        const currentTimeIst = moment().tz("Asia/Kolkata");
        const date = currentTimeIst.format("YYYY-MM-DD HH:mm:ss");
        const encodedResponse = JSON.stringify(req.body);
        const response = await Payment.create({ response: encodedResponse, date: date });
        const findUserPayment = await PaymentData.findOneById(data.order_id);

        if (findUserPayment.status !== "completed" && findUserPayment.status !== "rejected") {
            if (data && data.status === "completed") {
                // await User.addAmount(findUserPayment.userId, findUserPayment.amount);

                const findUser = await User.findOneById(findUserPayment.userId);
                await Transaction.create({
                    userId: findUserPayment.userId,
                    userBalance: findUser.balance,
                    transactionType: "upiMoney",
                    message: "Wallet amount added by UPI payment by user",
                    withdrawMoney: findUserPayment.amount,
                    date: date,
                    type: "add",
                });

                // await Deposit.updatePaymentStatus(data.order_id, "SUCCESS", "SUCCESS");
                await PaymentData.updateStatusByTransactionId(data.order_id, "completed");
            } else {
                // await Deposit.updatePaymentStatus(data.order_id, "FAILED", "FAILED");
                await PaymentData.updateStatusByTransactionId(data.order_id, "rejected");
            }

            return res.status(200).json({
                status: true,
                msg: "Payment data processed successfully",
                data: response,
            });
        } else {
            return res.status(200).json({
                status: false,
                msg: "Payment already processed", 
            });
        }

    } catch (error) {
        console.error("Error processing payment callback:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


exports.createDepositAbcGateway = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }
    const { userId, amount } = req.body;
    try {
        const user = await User.findOneById(userId);
        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }
        if (user.status === 'block') {
            return res.status(400).json({ status: false, msg: "Your account is blocked" });
        }
        const currentTimeIst = moment().tz("Asia/Kolkata");
        const date = currentTimeIst.format("YYYY-MM-DD HH:mm:ss");

        const generateCustomerRefernceNumber = uuidv4();
        const order_id = uuidv4();
        const createPaymentData = await createPaymentAbcGateway(order_id.substring(0, 8), amount, generateCustomerRefernceNumber.substring(0, 8), user.name, user.mobile, user.email, 'upiMoney', currentTimeIst.format('YYYY-MM-DD HH:mm:ss'), userId, 'UPI_VIP')
        if (createPaymentData.status === false) {
            return res.status(404).json({ status: false, msg: createPaymentData.details.message });
        }
        // const newDeposit = await Deposit.create({
        //     userId,
        //     amount,
        //     date,
        //     userBalance: user.balance,
        //     transactionId: createPaymentData.transaction_id,
        // });
        // const checkDeposit = await Deposit.findDepositById(newDeposit.id);
        const response = {
            userId: checkDeposit.userId,
            amount: checkDeposit.amount,
            paymentStatus: checkDeposit.paymentStatus,
            date: checkDeposit.date,
            merchantTransactionId: createPaymentData.transaction_id,
            clientId: createPaymentData.order_id,
            paymentUrl: createPaymentData.payment_url
        }
        return res.status(201).json({
            status: true,
            msg: "Deposit created successfully",
            data: response,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



async function createPaymentAbcGateway(order_id, amount, customerReferenceNumber, customer_name, customer_mobile, customer_email, paymentType, date, userId) {
    const apiKey = process.env.ABC_GATEWAY_API_KEY;

    try {
        const payload = {
            amount: parseFloat(amount).toFixed(2),
            orderId: order_id,
            customer_name: customer_name,
            customer_mobile: customer_mobile,
            customer_email: customer_email,
            note: "wallet recharge"
        }

        const response = await axios.post(
            'https://api.abcgate.shop/api/payments/initiate',
            payload, {
            headers: {
                'Content-Type': 'application/json',
                'api-token': apiKey
            }
        }
        );

        if (response.status === 200 && response.data.success == true) {
            const parsedResponse = response.data.data;

            const payment = await PaymentData.create({
                transactionId: parsedResponse.transaction_id,
                paymentMethod: 'UPI_VIP',
                userId: userId,
                amount: amount,
                paymentType: paymentType,
                date: date,
                status: 'initialized',
                clientId: parsedResponse.order_id,
                customer_reference_number: parsedResponse.transaction_id
            });

            return parsedResponse;
        } else {
            return { status: false, error: 'Invalid response from payment API', details: response.data };
        }

    } catch (error) {
        console.error('Error in createPaymentAbcGateway:', error);
        return error.response ? { status: false, error: '', details: error.response.data } : { error: 'Internal server error' };
    }
}