const activityLogsRepository = require('../repositories/activityLogs.repository');

class ActivityLogsController {
  async getLogs(req, res, next) {
    try {
      // Security Check: Make sure the company owns this application
      const companyId = req.user.companyId;
      const { id } = req.params; // application id
      
      const db = require('../config/db');
      const checkRes = await db.query(`
        SELECT a.id FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.id = $1 AND j.company_id = $2
      `, [id, companyId]);

      if (checkRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Aplikasi tidak ditemukan' });
      }

      const logs = await activityLogsRepository.getLogsByApplication(id);
      res.json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ActivityLogsController();
