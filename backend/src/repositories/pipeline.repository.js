const db = require('../config/db');

class PipelineRepository {
  async getPipelineStages(jobId) {
    const query = `
      SELECT id, name, order_index, type as anchor_type
      FROM job_pipeline_stages
      WHERE job_id = $1
      ORDER BY order_index ASC
    `;
    const res = await db.query(query, [jobId]);
    return res.rows;
  }

  async getApplicationsByJobId(jobId) {
    const query = `
      SELECT 
        a.id, a.current_stage_id, a.status, a.applied_at,
        c.email, cp.full_name, cp.headline
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      LEFT JOIN candidate_profiles cp ON c.id = cp.candidate_id
      WHERE a.job_id = $1
      ORDER BY a.applied_at DESC
    `;
    const res = await db.query(query, [jobId]);
    return res.rows;
  }

  async updateApplicationStage(applicationId, newStageId) {
    const query = `
      UPDATE applications
      SET current_stage_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const res = await db.query(query, [newStageId, applicationId]);
    return res.rows[0];
  }

  async updateApplicationStatus(applicationId, newStatus) {
    const query = `
      UPDATE applications
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const res = await db.query(query, [newStatus, applicationId]);
    return res.rows[0];
  }

  async getApplicationById(applicationId) {
    const query = `SELECT * FROM applications WHERE id = $1`;
    const res = await db.query(query, [applicationId]);
    return res.rows[0];
  }

  async logActivity(applicationId, actorType, actorId, actionType, description) {
    const query = `
      INSERT INTO activity_logs (application_id, actor_type, actor_id, action_type, description)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await db.query(query, [applicationId, actorType, actorId, actionType, description]);
  }
  async getHiredCountByJobId(jobId) {
    const query = `SELECT COUNT(*) FROM applications WHERE job_id = $1 AND status = 'hired'`;
    const res = await db.query(query, [jobId]);
    return parseInt(res.rows[0].count, 10);
  }

  async incrementFilledCount(jobId) {
    const query = `
      UPDATE jobs 
      SET filled_count = filled_count + 1 
      WHERE id = $1 AND (positions_available IS NULL OR filled_count < positions_available)
      RETURNING *
    `;
    const res = await db.query(query, [jobId]);
    if (res.rowCount === 0) {
      throw new Error('Overbooked: Kuota pekerjaan sudah penuh');
    }
    return res.rows[0];
  }
}

module.exports = new PipelineRepository();
