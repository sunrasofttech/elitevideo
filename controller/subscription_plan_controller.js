const SubscriptionPlanModel = require('../model/subscription_plan_model');

exports.createSubscriptionPlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlanModel.create(req.body);
        res.status(201).json({ status: true, message: 'Subscription plan created successfully.', data: plan });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error creating subscription plan.', data: error.message });
    }
};

exports.getAllSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlanModel.findAll();
        res.status(200).json({ status: true, message: 'Fetched all subscription plans.', data: plans });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error fetching plans.', data: error.message });
    }
};

exports.getSubscriptionPlanById = async (req, res) => {
    try {
        const plan = await SubscriptionPlanModel.findByPk(req.params.id);
        if (!plan) {
            return res.status(404).json({ status: false, message: 'Plan not found.', data: null });
        }
        res.status(200).json({ status: true, message: 'Plan fetched successfully.', data: plan });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error fetching plan.', data: error.message });
    }
};

exports.updateSubscriptionPlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlanModel.findByPk(req.params.id);
        if (!plan) {
            return res.status(404).json({ status: false, message: 'Plan not found.', data: null });
        }

        await plan.update(req.body);
        res.status(200).json({ status: true, message: 'Subscription plan updated.', data: plan });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error updating plan.', data: error.message });
    }
};

exports.deleteSubscriptionPlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlanModel.findByPk(req.params.id);
        if (!plan) {
            return res.status(404).json({ status: false, message: 'Plan not found.', data: null });
        }

        await plan.destroy();
        res.status(200).json({ status: true, message: 'Subscription plan deleted.', data: null });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error deleting plan.', data: error.message });
    }
};
