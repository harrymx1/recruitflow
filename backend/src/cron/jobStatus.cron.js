const cron = require('node-cron');
const db = require('../config/db');

const initCron = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Checking for expired jobs...');
    try {
      const query = `
        UPDATE jobs 
        SET status = 'closed' 
        WHERE status != 'closed' 
          AND deadline IS NOT NULL 
          AND deadline < CURRENT_TIMESTAMP
      `;
      const res = await db.query(query);
      if (res.rowCount > 0) {
        console.log(`[Cron] Closed ${res.rowCount} expired jobs.`);
      }
    } catch (err) {
      console.error('[Cron] Error updating job statuses:', err);
    }
  });
};

module.exports = { initCron };
