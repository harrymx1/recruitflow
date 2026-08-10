const db = require('../config/db');

class AnalyticsRepository {
  async getSummary(companyId) {
    const jobRes = await db.query('SELECT COUNT(*) as count FROM jobs WHERE company_id = $1', [companyId]);
    const candidateRes = await db.query(`
      SELECT COUNT(a.id) as count 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.company_id = $1
    `, [companyId]);
    
    const hiredRes = await db.query(`
      SELECT COUNT(a.id) as count 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.company_id = $1 AND a.status = 'hired'
    `, [companyId]);

    const activeRes = await db.query(`
      SELECT COUNT(a.id) as count 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.company_id = $1 AND a.status = 'active'
    `, [companyId]);

    return {
      total_jobs: parseInt(jobRes.rows[0].count, 10),
      total_applicants: parseInt(candidateRes.rows[0].count, 10),
      total_hired: parseInt(hiredRes.rows[0].count, 10),
      active_applications: parseInt(activeRes.rows[0].count, 10)
    };
  }

  async getFunnel(companyId) {
    // We group by status and stage for a simplified funnel
    const query = `
      SELECT 
        s.id as stage_id,
        s.name as stage_name,
        COUNT(a.id) as applicant_count
      FROM job_pipeline_stages s
      JOIN jobs j ON s.job_id = j.id
      LEFT JOIN applications a ON a.current_stage_id = s.id AND a.status = 'active'
      WHERE j.company_id = $1
      GROUP BY s.id, s.name
      ORDER BY MIN(s.order_index) ASC
    `;
    const activePipeline = await db.query(query, [companyId]);

    const statusQuery = `
      SELECT a.status, COUNT(a.id) as count
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.company_id = $1
      GROUP BY a.status
    `;
    const statusRes = await db.query(statusQuery, [companyId]);

    return {
      pipeline_stages: activePipeline.rows.map(r => ({ ...r, applicant_count: parseInt(r.applicant_count, 10) })),
      status_distribution: statusRes.rows.reduce((acc, r) => {
        acc[r.status] = parseInt(r.count, 10);
        return acc;
      }, {})
    };
  }

  async getSource(companyId) {
    const query = `
      SELECT COALESCE(a.source, 'unknown') as source, COUNT(a.id) as count
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.company_id = $1
      GROUP BY a.source
      ORDER BY count DESC
    `;
    const res = await db.query(query, [companyId]);
    return res.rows.map(r => ({ ...r, count: parseInt(r.count, 10) }));
  }
  async getTimeToHire(companyId) {
    const query = `
      SELECT 
        j.id as job_id,
        j.title as job_title,
        ROUND(AVG(EXTRACT(EPOCH FROM (a.updated_at - a.applied_at))/86400)::numeric, 1) as avg_days_to_hire,
        COUNT(a.id) as hires_count
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE j.company_id = $1 AND a.status = 'hired'
      GROUP BY j.id, j.title
      ORDER BY avg_days_to_hire DESC;
    `;
    const res = await db.query(query, [companyId]);
    return res.rows.map(r => ({
      job_id: r.job_id,
      job_title: r.job_title,
      avg_days_to_hire: parseFloat(r.avg_days_to_hire) || 0,
      hires_count: parseInt(r.hires_count, 10) || 0
    }));
  }
}

module.exports = new AnalyticsRepository();
