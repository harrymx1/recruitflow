const db = require('../config/db');

class HRCandidatesRepository {
  async getAllCandidates(companyId, filters = {}) {
    let query = `
      SELECT 
        a.id as application_id, a.status, a.applied_at,
        j.id as job_id, j.title as job_title,
        cp.full_name as first_name, '' as last_name, c.email, c.subscription_tier,
        cp.headline, cp.phone,
        COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name, 'color', t.color)) FILTER (WHERE t.id IS NOT NULL), '[]') as tags
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN candidate_profiles cp ON c.id = cp.candidate_id
      LEFT JOIN application_tags atg ON a.id = atg.application_id
      LEFT JOIN candidate_tags t ON atg.tag_id = t.id
      WHERE j.company_id = $1
    `;
    const values = [companyId];
    let valIdx = 2;

    if (filters.status && filters.status !== 'all') {
      query += ` AND a.status = $${valIdx}`;
      values.push(filters.status);
      valIdx++;
    }

    if (filters.search) {
      query += ` AND (c.first_name ILIKE $${valIdx} OR c.last_name ILIKE $${valIdx} OR j.title ILIKE $${valIdx})`;
      values.push(`%${filters.search}%`);
      valIdx++;
    }

    query += `
      GROUP BY a.id, j.id, c.id, cp.candidate_id
      ORDER BY (c.subscription_tier = 'premium') DESC, a.applied_at DESC
    `;

    const res = await db.query(query, values);
    return res.rows;
  }

  async getApplicationDetail(applicationId, companyId) {
    // 1. Get Application & Job info
    const appQuery = `
      SELECT 
        a.*,
        j.title as job_title, j.department,
        c.first_name, c.last_name, c.email,
        cp.headline, cp.summary, cp.phone, cp.location,
        s.name as stage_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN candidate_profiles cp ON c.id = cp.candidate_id
      LEFT JOIN job_pipeline_stages s ON a.current_stage_id = s.id
      WHERE a.id = $1 AND j.company_id = $2
    `;
    const appRes = await db.query(appQuery, [applicationId, companyId]);
    if (appRes.rows.length === 0) return null;
    const application = appRes.rows[0];

    // 2. Get Tags
    const tagsQuery = `
      SELECT t.id, t.name, t.color
      FROM application_tags atg
      JOIN candidate_tags t ON atg.tag_id = t.id
      WHERE atg.application_id = $1
    `;
    const tagsRes = await db.query(tagsQuery, [applicationId]);
    application.tags = tagsRes.rows;

    // 3. Get Answers
    const ansQuery = `
      SELECT ans.answer_text, q.question_text
      FROM application_answers ans
      JOIN job_custom_questions q ON ans.question_id = q.id
      WHERE ans.application_id = $1
    `;
    const ansRes = await db.query(ansQuery, [applicationId]);
    application.answers = ansRes.rows;

    // 4. Get Candidate Experiences, Education, Skills
    const candidateId = application.candidate_id;
    const expRes = await db.query('SELECT * FROM candidate_experiences WHERE candidate_id = $1 ORDER BY start_date DESC', [candidateId]);
    application.experiences = expRes.rows;

    const eduRes = await db.query('SELECT * FROM candidate_educations WHERE candidate_id = $1 ORDER BY end_date DESC NULLS FIRST', [candidateId]);
    application.educations = eduRes.rows;

    const skillRes = await db.query('SELECT * FROM candidate_skills WHERE candidate_id = $1', [candidateId]);
    application.skills = skillRes.rows;

    // 4. Get Interviews
    const intQuery = `
      SELECT id, title, scheduled_at, duration_minutes, meeting_link, location, status, notes
      FROM interviews
      WHERE application_id = $1
      ORDER BY scheduled_at ASC
    `;
    const intRes = await db.query(intQuery, [applicationId]);
    application.interviews = intRes.rows;

    return application;
  }

  async updateDecision(applicationId, companyId, status) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Verify application belongs to the company
      const checkQuery = `
        SELECT a.id, a.job_id, a.status as current_status
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.id = $1 AND j.company_id = $2
      `;
      const checkRes = await client.query(checkQuery, [applicationId, companyId]);
      if (checkRes.rows.length === 0) {
        throw new Error('Aplikasi tidak ditemukan');
      }

      const { job_id, current_status } = checkRes.rows[0];

      if (current_status === 'withdrawn') {
        throw new Error('Tidak dapat mengubah status aplikasi yang telah ditarik oleh kandidat');
      }

      // Update application status
      const updateQuery = `
        UPDATE applications
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      const updateRes = await client.query(updateQuery, [status, applicationId]);

      // Log activity
      const activityLogsRepository = require('./activityLogs.repository');
      await activityLogsRepository.logActivity({
        application_id: applicationId,
        actor_type: 'company_member',
        actor_id: null, // Note: For a proper implementation, companyMemberId should be passed to this function
        action_type: status === 'hired' ? 'Status Hired' : 'Status Rejected',
        description: `Kandidat diubah status lamarannya menjadi ${status}.`
      });

      // If hired, increment job filled_count
      if (status === 'hired') {
        await client.query(`
          UPDATE jobs
          SET filled_count = filled_count + 1
          WHERE id = $1
        `, [job_id]);
      }

      await client.query('COMMIT');
      return updateRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = new HRCandidatesRepository();
