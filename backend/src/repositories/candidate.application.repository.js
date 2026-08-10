const db = require('../config/db');

class CandidateApplicationRepository {
  async applyForJob(candidateId, data) {
    const { job_id, documents, cover_letter, source, answers } = data;

    // Start transaction
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // 1. Check if already applied (status active or rejected/hired, but not withdrawn)
      const checkQuery = `
        SELECT id, status FROM applications 
        WHERE candidate_id = $1 AND job_id = $2 AND status != 'withdrawn'
      `;
      const checkRes = await client.query(checkQuery, [candidateId, job_id]);
      if (checkRes.rows.length > 0) {
        throw new Error('Anda sudah melamar pekerjaan ini');
      }

      // 2. Find the initial stage for this job (order_index = 1)
      const stageQuery = `
        SELECT id FROM job_pipeline_stages 
        WHERE job_id = $1 ORDER BY order_index ASC LIMIT 1
      `;
      const stageRes = await client.query(stageQuery, [job_id]);
      let currentStageId = null;
      if (stageRes.rows.length > 0) {
        currentStageId = stageRes.rows[0].id;
      }

      // 3. Insert into applications
      const applyQuery = `
        INSERT INTO applications (
          job_id, candidate_id, current_stage_id, status, cover_letter, source
        ) VALUES (
          $1, $2, $3, 'active', $4, $5
        ) RETURNING id
      `;
      const applyRes = await client.query(applyQuery, [
        job_id, candidateId, currentStageId, cover_letter, source
      ]);
      const applicationId = applyRes.rows[0].id;

      // 3.5 Insert into application_documents
      if (documents && documents.length > 0) {
        for (const doc of documents) {
          const docQuery = `
            INSERT INTO application_documents (application_id, label, file_url)
            VALUES ($1, $2, $3)
          `;
          await client.query(docQuery, [applicationId, doc.label || 'Document', doc.file_url]);
        }
      }

      // 4. Insert custom answers if any
      if (answers && answers.length > 0) {
        for (const ans of answers) {
          const ansQuery = `
            INSERT INTO application_answers (application_id, question_id, answer_text)
            VALUES ($1, $2, $3)
          `;
          await client.query(ansQuery, [applicationId, ans.question_id, ans.answer_text]);
        }
      }

      // 5. Update applicants_count in jobs
      await client.query(`UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = $1`, [job_id]);

      // 6. Log Activity
      const logQuery = `
        INSERT INTO activity_logs (application_id, actor_type, actor_id, action_type, description)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await client.query(logQuery, [
        applicationId, 'candidate', candidateId, 'Lamaran Terkirim', 'Kandidat mengirimkan lamaran untuk pekerjaan ini.'
      ]);

      await client.query('COMMIT');
      return { id: applicationId };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getApplications(candidateId) {
    const query = `
      SELECT 
        a.id, a.status, a.applied_at, a.updated_at,
        j.id as job_id, j.title as job_title, j.location_id,
        c.name as company_name, c.logo_url as company_logo,
        (SELECT name FROM company_locations cl WHERE cl.id = j.location_id LIMIT 1) as location
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE a.candidate_id = $1
      ORDER BY a.applied_at DESC
    `;
    const res = await db.query(query, [candidateId]);
    return res.rows;
  }

  async getApplicationById(applicationId, candidateId) {
    // Basic app info
    const query = `
      SELECT 
        a.*,
        j.title as job_title,
        c.name as company_name, c.logo_url as company_logo,
        s.name as stage_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      LEFT JOIN job_pipeline_stages s ON a.current_stage_id = s.id
      WHERE a.id = $1 AND a.candidate_id = $2
    `;
    const res = await db.query(query, [applicationId, candidateId]);
    const application = res.rows[0];

    if (application) {
      // Get answers
      const ansQuery = `
        SELECT ans.answer_text, q.question_text
        FROM application_answers ans
        JOIN job_custom_questions q ON ans.question_id = q.id
        WHERE ans.application_id = $1
      `;
      const ansRes = await db.query(ansQuery, [applicationId]);
      application.answers = ansRes.rows;

      // Get documents
      const docsQuery = `
        SELECT label, file_url, created_at
        FROM application_documents
        WHERE application_id = $1
        ORDER BY created_at ASC
      `;
      const docsRes = await db.query(docsQuery, [applicationId]);
      application.documents = docsRes.rows;

      // Get interviews scheduled for this application (public info only — no internal notes)
      const intQuery = `
        SELECT id, title, scheduled_at, duration_minutes, meeting_link, location, status
        FROM interviews
        WHERE application_id = $1 AND status != 'cancelled'
        ORDER BY scheduled_at ASC
      `;
      const intRes = await db.query(intQuery, [applicationId]);
      application.interviews = intRes.rows;
    }

    return application;
  }

  async withdrawApplication(applicationId, candidateId) {
    const query = `
      UPDATE applications 
      SET status = 'withdrawn', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND candidate_id = $2 AND status = 'active'
      RETURNING *
    `;
    const res = await db.query(query, [applicationId, candidateId]);
    if (res.rows.length === 0) {
      throw new Error('Aplikasi tidak ditemukan atau tidak dapat ditarik');
    }

    // Log Activity
    const activityLogsRepository = require('./activityLogs.repository');
    await activityLogsRepository.logActivity({
      application_id: applicationId,
      actor_type: 'candidate',
      actor_id: candidateId,
      action_type: 'Lamaran Ditarik',
      description: `Kandidat menarik lamaran.`
    });

    return res.rows[0];
  }
}

module.exports = new CandidateApplicationRepository();
