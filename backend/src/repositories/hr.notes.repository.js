const db = require('../config/db');

class HRNotesRepository {
  async getNotes(applicationId) {
    const query = `
      SELECT n.*, m.name as first_name, '' as last_name, m.role
      FROM application_notes n
      JOIN company_members m ON n.company_member_id = m.id
      WHERE n.application_id = $1
      ORDER BY n.created_at DESC
    `;
    const res = await db.query(query, [applicationId]);
    return res.rows;
  }

  async addNote(applicationId, companyMemberId, noteText) {
    const query = `
      INSERT INTO application_notes (application_id, company_member_id, note_text)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const res = await db.query(query, [applicationId, companyMemberId, noteText]);
    
    // Fetch with member info to return full object
    const fetchQuery = `
      SELECT n.*, m.name as first_name, '' as last_name, m.role
      FROM application_notes n
      JOIN company_members m ON n.company_member_id = m.id
      WHERE n.id = $1
    `;
    const finalRes = await db.query(fetchQuery, [res.rows[0].id]);
    
    // Log Activity
    const activityLogsRepository = require('./activityLogs.repository');
    await activityLogsRepository.logActivity({
      application_id: applicationId,
      actor_type: 'company_member',
      actor_id: companyMemberId,
      action_type: 'Catatan Ditambahkan',
      description: `HR menambahkan catatan evaluasi.`
    });

    return finalRes.rows[0];
  }
}

module.exports = new HRNotesRepository();
