const db = require('../config/db');

class HREmailTemplatesRepository {
  async getTemplate(companyId, type) {
    const query = `
      SELECT * FROM email_templates
      WHERE company_id = $1 AND type = $2
    `;
    const res = await db.query(query, [companyId, type]);
    
    // If not found, return default
    if (res.rows.length === 0) {
      if (type === 'offer') {
        return {
          type: 'offer',
          subject: 'Offer from {{company_name}} for {{job_title}}',
          body: 'Dear {{candidate_name}},\n\nWe are pleased to offer you the position of {{job_title}} at {{company_name}}.\n\nPlease find the details attached.\n\nBest regards,\nThe Hiring Team'
        };
      } else {
        return {
          type: 'reject',
          subject: 'Update on your application for {{job_title}}',
          body: 'Dear {{candidate_name}},\n\nThank you for taking the time to interview with us for the {{job_title}} position at {{company_name}}.\n\nWhile we were impressed by your background, we have decided to move forward with other candidates at this time.\n\nWe wish you the best in your job search.\n\nBest regards,\nThe Hiring Team'
        };
      }
    }
    
    return res.rows[0];
  }

  async saveTemplate(companyId, type, subject, body) {
    const query = `
      INSERT INTO email_templates (company_id, type, subject, body)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (company_id, type)
      DO UPDATE SET subject = EXCLUDED.subject, body = EXCLUDED.body, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const res = await db.query(query, [companyId, type, subject, body]);
    return res.rows[0];
  }
}

module.exports = new HREmailTemplatesRepository();
