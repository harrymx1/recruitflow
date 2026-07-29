const db = require('../config/db');

class JobRepository {
  async getJobsByCompanyId(companyId) {
    const query = `
      SELECT id, title, department, employment_type, status, is_published, created_at, views_count, applicants_count
      FROM jobs 
      WHERE company_id = $1
      ORDER BY created_at DESC
    `;
    const res = await db.query(query, [companyId]);
    return res.rows;
  }

  async getJobById(companyId, jobId) {
    const query = `
      SELECT * 
      FROM jobs 
      WHERE company_id = $1 AND id = $2
    `;
    const res = await db.query(query, [companyId, jobId]);
    return res.rows[0];
  }

  async createJob(jobData) {
    const allowedFields = [
      'company_id', 'title', 'department', 'location_id', 'employment_type', 
      'experience_level', 'description', 'requirements', 
      'salary_min', 'salary_max', 'salary_currency', 'is_remote', 
      'status', 'deadline'
    ];

    const fields = [];
    const placeholders = [];
    const values = [];
    let idx = 1;

    for (const key of allowedFields) {
      if (jobData[key] !== undefined) {
        fields.push(key);
        placeholders.push(`$${idx}`);
        values.push(jobData[key]);
        idx++;
      }
    }

    const query = `
      INSERT INTO jobs (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;

    const res = await db.query(query, values);
    return res.rows[0];
  }

  async updateJob(companyId, jobId, updateData) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updateData)) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }

    if (fields.length === 0) return null;

    values.push(companyId);
    values.push(jobId);
    
    const query = `
      UPDATE jobs 
      SET ${fields.join(', ')} 
      WHERE company_id = $${idx} AND id = $${idx + 1}
      RETURNING *
    `;

    const res = await db.query(query, values);
    return res.rows[0];
  }

  async deleteJob(companyId, jobId) {
    const query = `
      DELETE FROM jobs 
      WHERE company_id = $1 AND id = $2
      RETURNING id
    `;
    const res = await db.query(query, [companyId, jobId]);
    return res.rowCount > 0;
  }

  // --- Custom Questions ---
  async getCustomQuestions(jobId) {
    const res = await db.query('SELECT * FROM job_custom_questions WHERE job_id = $1 ORDER BY order_index ASC', [jobId]);
    return res.rows;
  }

  async saveCustomQuestions(jobId, questions) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM job_custom_questions WHERE job_id = $1', [jobId]);
      
      const inserted = [];
      for (const [index, q] of questions.entries()) {
        const res = await client.query(
          'INSERT INTO job_custom_questions (job_id, question_text, question_type, is_required, options, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [jobId, q.question_text, q.question_type, q.is_required !== false, q.options ? JSON.stringify(q.options) : null, index]
        );
        inserted.push(res.rows[0]);
      }
      
      await client.query('COMMIT');
      return inserted;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  // --- Pipeline Stages ---
  async getPipelineStages(jobId) {
    const res = await db.query('SELECT * FROM job_pipeline_stages WHERE job_id = $1 ORDER BY order_index ASC', [jobId]);
    return res.rows;
  }

  async savePipelineStages(jobId, stages) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM job_pipeline_stages WHERE job_id = $1', [jobId]);
      
      const inserted = [];
      for (const [index, stage] of stages.entries()) {
        const res = await client.query(
          'INSERT INTO job_pipeline_stages (job_id, name, type, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
          [jobId, stage.name, stage.type || 'custom', index]
        );
        inserted.push(res.rows[0]);
      }
      
      await client.query('COMMIT');
      return inserted;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

module.exports = new JobRepository();
