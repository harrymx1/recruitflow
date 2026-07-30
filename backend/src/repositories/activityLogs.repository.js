const db = require('../config/db');

class ActivityLogsRepository {
  /**
   * Log an activity for an application.
   * @param {Object} data 
   * @param {string} data.application_id
   * @param {string} data.actor_type - 'company_member', 'candidate', 'system'
   * @param {string|null} data.actor_id 
   * @param {string} data.action_type
   * @param {string} data.description
   */
  async logActivity(data) {
    const { application_id, actor_type, actor_id, action_type, description } = data;
    const query = `
      INSERT INTO activity_logs (application_id, actor_type, actor_id, action_type, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const res = await db.query(query, [application_id, actor_type, actor_id || null, action_type, description]);
    return res.rows[0];
  }

  /**
   * Get all activity logs for an application
   * @param {string} applicationId 
   */
  async getLogsByApplication(applicationId) {
    const query = `
      SELECT 
        al.*,
        CASE 
          WHEN al.actor_type = 'company_member' THEN (SELECT first_name || ' ' || last_name FROM company_members WHERE id = al.actor_id)
          WHEN al.actor_type = 'candidate' THEN (SELECT first_name || ' ' || last_name FROM candidates WHERE id = al.actor_id)
          ELSE 'Sistem'
        END as actor_name
      FROM activity_logs al
      WHERE al.application_id = $1
      ORDER BY al.created_at DESC
    `;
    const res = await db.query(query, [applicationId]);
    return res.rows;
  }
}

module.exports = new ActivityLogsRepository();
