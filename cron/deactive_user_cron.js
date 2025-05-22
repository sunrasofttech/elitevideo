const cron = require('node-cron');
const userController = require('../controller/user_controller');

// Run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily cron to deactivate inactive users...');
    await userController.deactivateInactiveUsers();
});