const db = require('../config/db');

class HRInterviewsRepository {
  async scheduleInterview(applicationId, companyId, data) {
    const { title, scheduled_at, duration_minutes, meeting_link, location, notes } = data;
    
    // Verify application belongs to this company
    const checkQuery = `
      SELECT a.id FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = $1 AND j.company_id = $2
    `;
    const checkRes = await db.query(checkQuery, [applicationId, companyId]);
    if (checkRes.rows.length === 0) throw new Error('Aplikasi tidak valid');

    const insertQuery = `
      INSERT INTO interviews (application_id, company_id, title, scheduled_at, duration_minutes, meeting_link, location, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const res = await db.query(insertQuery, [
      applicationId, companyId, title, scheduled_at, duration_minutes, meeting_link, location, notes
    ]);
    
    // Log Activity
    const activityLogsRepository = require('./activityLogs.repository');
    await activityLogsRepository.logActivity({
      application_id: applicationId,
      actor_type: 'company_member',
      actor_id: null,
      action_type: 'Jadwal Wawancara Dibuat',
      description: `Wawancara '${title}' dijadwalkan pada ${new Date(scheduled_at).toLocaleString('id-ID')}.`
    });

    return res.rows[0];
  }

  async getInterviews(companyId) {
    const query = `
      SELECT 
        i.*,
        a.candidate_id, a.job_id,
        j.title as job_title,
        c.first_name, c.last_name, c.email
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN jobs j ON a.job_id = j.id
      JOIN candidates c ON a.candidate_id = c.id
      WHERE i.company_id = $1
      ORDER BY i.scheduled_at ASC
    `;
    const res = await db.query(query, [companyId]);
    return res.rows;
  }

  async updateInterview(interviewId, companyId, data) {
    const { title, scheduled_at, duration_minutes, meeting_link, location, notes, status } = data;
    const query = `
      UPDATE interviews
      SET
        title = COALESCE($1, title),
        scheduled_at = COALESCE($2, scheduled_at),
        duration_minutes = COALESCE($3, duration_minutes),
        meeting_link = COALESCE($4, meeting_link),
        location = COALESCE($5, location),
        notes = COALESCE($6, notes),
        status = COALESCE($7, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND company_id = $9
      RETURNING *
    `;
    const res = await db.query(query, [
      title, scheduled_at, duration_minutes, meeting_link, location, notes, status,
      interviewId, companyId
    ]);
    if (res.rows.length === 0) throw new Error('Wawancara tidak ditemukan');
    
    // Log Activity
    const activityLogsRepository = require('./activityLogs.repository');
    await activityLogsRepository.logActivity({
      application_id: res.rows[0].application_id,
      actor_type: 'company_member',
      actor_id: null,
      action_type: 'Jadwal Wawancara Diperbarui',
      description: `Wawancara diperbarui (Status: ${status || res.rows[0].status}).`
    });

    return res.rows[0];
  }

  async cancelInterview(interviewId, companyId) {
    const query = `
      UPDATE interviews
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND company_id = $2
      RETURNING id
    `;
    const res = await db.query(query, [interviewId, companyId]);
    if (res.rows.length === 0) throw new Error('Wawancara tidak ditemukan');

    // Log Activity
    const activityLogsRepository = require('./activityLogs.repository');
    await activityLogsRepository.logActivity({
      application_id: res.rows[0].application_id,
      actor_type: 'company_member',
      actor_id: null,
      action_type: 'Wawancara Dibatalkan',
      description: `Jadwal wawancara dibatalkan.`
    });

    return res.rows[0];
  }
}

module.exports = new HRInterviewsRepository();
