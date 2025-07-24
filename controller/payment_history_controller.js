const PaymentHistory = require('../model/payment_history_model');

exports.createPayment = async (req, res) => {
    try {
        const { order_id } = req.body;
         const existingPayment = await PaymentHistory.findOne({ where: { order_id } });
        if (existingPayment) {
            return res.status(400).json({
                status: false,
                message: "Payment already exists for this order_id"
            });
        }

        const payment = await PaymentHistory.create(req.body);
        res.status(201).json({
            status: true,
            message: `Payment created successfully with status: ${payment.status}`,
            data: payment
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};

// Get all payment history
exports.getAllPayments = async (req, res) => {
    try {
         const { status, user_id } = req.query;

           const whereClause = {};
        if (status) whereClause.status = status;
        if (user_id) whereClause.user_id = user_id;

        const payments = await PaymentHistory.findAll({
              where: whereClause,
            include: ['user'] 
        });
        res.status(200).json({
            status: true,
            message: "All payments fetched successfully",
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await PaymentHistory.findByPk(req.params.id, { include: ['user'] });
        if (!payment) {
            return res.status(404).json({
                status: false,
                message: "Payment not found",
                data: null
            });
        }
        res.status(200).json({
            status: true,
            message: "Payment fetched successfully",
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};

// Update payment
exports.updatePayment = async (req, res) => {
    try {
        const [updated] = await PaymentHistory.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({
                status: false,
                message: "Payment not found",
                data: null
            });
        }
        const updatedPayment = await PaymentHistory.findByPk(req.params.id);
        res.status(200).json({
            status: true,
            message: "Payment updated successfully",
            data: updatedPayment
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};

// Delete payment
exports.deletePayment = async (req, res) => {
    try {
        const deleted = await PaymentHistory.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({
                status: false,
                message: "Payment not found",
                data: null
            });
        }
        res.status(200).json({
            status: true,
            message: "Payment deleted successfully",
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
};
