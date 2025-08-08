const express = require('express');
const router = express.Router();
const subscriptionPlanController = require('../controller/subscription_plan_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/', subscriptionPlanController.createSubscriptionPlan);
router.post('/get-all', subscriptionPlanController.getAllSubscriptionPlans);
router.post('/:id', subscriptionPlanController.getSubscriptionPlanById);
router.put('/:id', subscriptionPlanController.updateSubscriptionPlan);
router.delete('/:id', subscriptionPlanController.deleteSubscriptionPlan);

module.exports = router;
