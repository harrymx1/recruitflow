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
      'experience_level', 'description', 'requirements', 'responsibilities',
      'salary_min', 'salary_max', 'salary_currency', 'is_remote', 
      'work_arrangement', 'duration_min', 'duration_max', 'duration_unit', 'is_paid',
      'positions_available', 'status', 'is_published', 'deadline'
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
      
      // Get existing questions
      const { rows: existingQs } = await client.query('SELECT id FROM job_custom_questions WHERE job_id = $1', [jobId]);
      const existingIds = existingQs.map(q => q.id);
      const incomingIds = questions.filter(q => q.id).map(q => q.id);
      
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      
      // Delete removed questions
      if (idsToDelete.length > 0) {
        try {
          await client.query('DELETE FROM job_custom_questions WHERE id = ANY($1::uuid[])', [idsToDelete]);
        } catch (err) {
          if (err.code === '23503') { // foreign_key_violation
            const customErr = new Error('Gagal menyimpan: Tidak dapat menghapus pertanyaan yang sudah dijawab oleh kandidat.');
            customErr.statusCode = 400;
            throw customErr;
          }
          throw err;
        }
      }
      
      const upserted = [];
      for (const [index, q] of questions.entries()) {
        if (q.id) {
          const res = await client.query(
            'UPDATE job_custom_questions SET question_text = $1, question_type = $2, options = $3, is_required = $4, order_index = $5 WHERE id = $6 RETURNING *',
            [q.question_text, q.question_type, q.options ? JSON.stringify(q.options) : null, q.is_required !== false, index, q.id]
          );
          upserted.push(res.rows[0]);
        } else {
          const res = await client.query(
            'INSERT INTO job_custom_questions (job_id, question_text, question_type, is_required, options, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [jobId, q.question_text, q.question_type, q.is_required !== false, q.options ? JSON.stringify(q.options) : null, index]
          );
          upserted.push(res.rows[0]);
        }
      }
      
      await client.query('COMMIT');
      return upserted;
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
      
      // Get existing stages
      const { rows: existingStages } = await client.query('SELECT id FROM job_pipeline_stages WHERE job_id = $1', [jobId]);
      const existingIds = existingStages.map(s => s.id);
      const incomingIds = stages.filter(s => s.id).map(s => s.id);
      
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      
      // Delete removed stages
      if (idsToDelete.length > 0) {
        try {
          await client.query('DELETE FROM job_pipeline_stages WHERE id = ANY($1::uuid[])', [idsToDelete]);
        } catch (err) {
          if (err.code === '23503') { // foreign_key_violation
            const customErr = new Error('Gagal menyimpan: Tidak dapat menghapus tahap pipeline yang sudah berisi kandidat aktif.');
            customErr.statusCode = 400;
            throw customErr;
          }
          throw err;
        }
      }
      
      const upserted = [];
      for (const [index, stage] of stages.entries()) {
        if (stage.id) {
          const res = await client.query(
            'UPDATE job_pipeline_stages SET name = $1, type = $2, order_index = $3 WHERE id = $4 RETURNING *',
            [stage.name, stage.type || 'custom', index, stage.id]
          );
          upserted.push(res.rows[0]);
        } else {
          const res = await client.query(
            'INSERT INTO job_pipeline_stages (job_id, name, type, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
            [jobId, stage.name, stage.type || 'custom', index]
          );
          upserted.push(res.rows[0]);
        }
      }
      
      await client.query('COMMIT');
      return upserted;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

module.exports = new JobRepository();
