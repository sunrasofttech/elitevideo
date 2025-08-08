const express = require('express');
const router = express.Router();
const subscriptionPlanController = require('../controller/subscription_plan_controller');
const Authenticate = require('../middleware/jwt_middleware');


router.post('/',Authenticate, subscriptionPlanController.createSubscriptionPlan);
router.post('/get-all',Authenticate, subscriptionPlanController.getAllSubscriptionPlans);
router.post('/:id',Authenticate, subscriptionPlanController.getSubscriptionPlanById);
router.put('/:id',Authenticate, subscriptionPlanController.updateSubscriptionPlan);
router.delete('/:id',Authenticate, subscriptionPlanController.deleteSubscriptionPlan);

module.exports = router;
