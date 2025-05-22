const cron = require('node-cron');
const { clearExpiredSubscriptions } = require('../controller/user_controller');

// Run everyday at 12:00 AM
cron.schedule('0 0 * * *', async () => {
  console.log('Running cron to clear expired subscriptions...');
  await clearExpiredSubscriptions();
});
