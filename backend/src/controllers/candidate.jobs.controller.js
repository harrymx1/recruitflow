const db = require('../config/db');

class CandidateJobsController {
  async saveJob(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const { jobId } = req.params;

      const query = `
        INSERT INTO saved_jobs (candidate_id, job_id) 
        VALUES ($1, $2) 
        ON CONFLICT (candidate_id, job_id) DO NOTHING
        RETURNING *
      `;
      const result = await db.query(query, [candidateId, jobId]);
      
      res.json({ success: true, data: result.rows[0], message: 'Job saved successfully' });
    } catch (err) {
      if (err.code === '23503') { // foreign key violation
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      next(err);
    }
  }

  async removeSavedJob(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const { jobId } = req.params;

      const query = `
        DELETE FROM saved_jobs 
        WHERE candidate_id = $1 AND job_id = $2
        RETURNING *
      `;
      const result = await db.query(query, [candidateId, jobId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Saved job not found' });
      }

      res.json({ success: true, message: 'Job removed from saved list' });
    } catch (err) {
      next(err);
    }
  }

  async getSavedJobs(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      
      const query = `
        SELECT 
          sj.id as saved_job_id, sj.created_at as saved_at,
          j.id, j.title, j.department, j.employment_type, j.work_arrangement, j.experience_level, 
          j.salary_min, j.salary_max, j.salary_currency, j.deadline, j.positions_available, 
          j.is_paid, j.duration_min, j.duration_max, j.duration_unit, j.created_at, j.status as job_status,
          c.name as company_name, c.logo_url as company_logo, c.slug as company_slug,
          (SELECT name FROM company_locations WHERE company_id = c.id AND is_headquarters = true LIMIT 1) as location
        FROM saved_jobs sj
        JOIN jobs j ON sj.job_id = j.id
        JOIN companies c ON j.company_id = c.id
        WHERE sj.candidate_id = $1
        ORDER BY sj.created_at DESC
      `;
      const result = await db.query(query, [candidateId]);
      
      res.json({ success: true, data: result.rows });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CandidateJobsController();
