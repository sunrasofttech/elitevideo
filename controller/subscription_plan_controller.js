const SubscriptionPlanModel = require('../model/subscription_plan_model');
const { Op } = require('sequelize');


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
    let { page = 1, limit = 10, status, plan_name } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (status !== undefined) {
      // Convert to boolean
      whereCondition.status = status === 'true';
    }

    if (plan_name) {
      whereCondition.plan_name = { [Op.like]: `%${plan_name}%` }; 
    }

    const { count, rows } = await SubscriptionPlanModel.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: true,
      message: 'Fetched subscription plans successfully',
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching plans.',
      data: error.message,
    });
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
