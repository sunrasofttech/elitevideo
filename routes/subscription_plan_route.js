const express = require('express');
const router = express.Router();
const subscriptionPlanController = require('../controller/subscription_plan_controller');
const Authenticate = require('../middleware/jwt_middleware');
const adminAuthenticate = require('../middleware/admin_auth');

router.post('/', adminAuthenticate, subscriptionPlanController.createSubscriptionPlan);
router.post('/admin/get-all', adminAuthenticate, subscriptionPlanController.getAllSubscriptionPlans);
router.post('/get-all', Authenticate, subscriptionPlanController.getAllSubscriptionPlans);
router.post('/:id', adminAuthenticate, subscriptionPlanController.getSubscriptionPlanById);
router.put('/:id', adminAuthenticate, subscriptionPlanController.updateSubscriptionPlan);
router.delete('/:id', adminAuthenticate, subscriptionPlanController.deleteSubscriptionPlan);

module.exports = router;
