const db = require('../config/db');

class PublicJobRepository {
  async searchJobs(filters = {}, sortPriority = [], pagination = { limit: 10, offset: 0 }) {
    let query = `
      SELECT 
        j.id, j.title, j.department, j.employment_type, j.work_arrangement, j.experience_level, 
        j.salary_min, j.salary_max, j.salary_currency, j.deadline, j.positions_available, 
        j.is_paid, j.duration_min, j.duration_max, j.duration_unit, j.created_at,
        c.name as company_name, c.logo_url as company_logo, c.slug as company_slug,
        (SELECT name FROM company_locations WHERE company_id = c.id AND is_headquarters = true LIMIT 1) as location,
        COALESCE(j.applicants_count, 0) as applicants_count
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'published'
        AND (j.deadline IS NULL OR j.deadline > CURRENT_DATE)
    `;

    const values = [];
    let valueIndex = 1;

    // Filters
    if (filters.keyword) {
      // Basic ilike search on title or department
      query += ` AND (j.title ILIKE $${valueIndex} OR j.department ILIKE $${valueIndex} OR c.name ILIKE $${valueIndex})`;
      values.push(`%${filters.keyword}%`);
      valueIndex++;
    }

    if (filters.employment_type && filters.employment_type.length > 0) {
      query += ` AND j.employment_type = ANY($${valueIndex})`;
      values.push(filters.employment_type);
      valueIndex++;
    }

    if (filters.work_arrangement && filters.work_arrangement.length > 0) {
      query += ` AND j.work_arrangement = ANY($${valueIndex})`;
      values.push(filters.work_arrangement);
      valueIndex++;
    }

    if (filters.experience_level && filters.experience_level.length > 0) {
      query += ` AND j.experience_level = ANY($${valueIndex})`;
      values.push(filters.experience_level);
      valueIndex++;
    }

    if (filters.company_id) {
      query += ` AND j.company_id = $${valueIndex}`;
      values.push(filters.company_id);
      valueIndex++;
    }

    // Sort Priority
    // Allowed sorts: 'terbaru', 'kuota', 'pelamar_terbanyak', 'pelamar_tersedikit', 'deadline_terdekat', 'relevan'
    const orderClauses = [];
    
    if (sortPriority && sortPriority.length > 0) {
      sortPriority.forEach(sortType => {
        switch (sortType) {
          case 'terbaru':
            orderClauses.push('j.created_at DESC');
            break;
          case 'kuota':
            orderClauses.push('j.positions_available DESC');
            break;
          case 'pelamar_terbanyak':
            orderClauses.push('applicants_count DESC');
            break;
          case 'pelamar_tersedikit':
            orderClauses.push('applicants_count ASC');
            break;
          case 'deadline_terdekat':
            orderClauses.push('j.deadline ASC NULLS LAST');
            break;
          // 'relevan' could be handled by tsvector, but since we used ilike, we skip it or sort by title match
        }
      });
    }

    // Default sort if nothing selected
    if (orderClauses.length === 0) {
      orderClauses.push('j.created_at DESC');
    }

    query += ` ORDER BY ${orderClauses.join(', ')}`;
    
    // Pagination
    query += ` LIMIT $${valueIndex} OFFSET $${valueIndex + 1}`;
    values.push(pagination.limit, pagination.offset);

    // Get count for pagination
    const countQuery = `
      SELECT COUNT(*)
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'published'
        AND (j.deadline IS NULL OR j.deadline > CURRENT_DATE)
    ` + query.substring(query.indexOf('WHERE') + 94, query.indexOf('ORDER BY')).replace(/j\.title ILIKE \$(\d+)/g, (match, p1) => {
      // Need to adjust params for count query, but since values array is the same (minus limit/offset), we can use it.
      return match;
    }); // This is tricky, a better way is to construct where clauses cleanly

    // Let's rewrite query construction to be cleaner
    return this.executeSearch(filters, sortPriority, pagination);
  }

  async executeSearch(filters, sortPriority, pagination) {
    const whereClauses = ["j.status = 'published'", "(j.deadline IS NULL OR j.deadline > CURRENT_DATE)"];
    const values = [];
    let valueIndex = 1;

    if (filters.keyword) {
      whereClauses.push(`(j.title ILIKE $${valueIndex} OR j.department ILIKE $${valueIndex} OR c.name ILIKE $${valueIndex})`);
      values.push(`%${filters.keyword}%`);
      valueIndex++;
    }

    if (filters.employment_type && filters.employment_type.length > 0) {
      whereClauses.push(`j.employment_type = ANY($${valueIndex})`);
      values.push(filters.employment_type);
      valueIndex++;
    }

    if (filters.work_arrangement && filters.work_arrangement.length > 0) {
      whereClauses.push(`j.work_arrangement = ANY($${valueIndex})`);
      values.push(filters.work_arrangement);
      valueIndex++;
    }

    if (filters.experience_level && filters.experience_level.length > 0) {
      whereClauses.push(`j.experience_level = ANY($${valueIndex})`);
      values.push(filters.experience_level);
      valueIndex++;
    }

    if (filters.company_id) {
      whereClauses.push(`j.company_id = $${valueIndex}`);
      values.push(filters.company_id);
      valueIndex++;
    }

    const whereString = 'WHERE ' + whereClauses.join(' AND ');

    let countQuery = `
      SELECT COUNT(*)
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      ${whereString}
    `;

    const { rows: countRows } = await db.query(countQuery, values);
    const totalCount = parseInt(countRows[0].count, 10);

    const orderClauses = [];
    if (sortPriority && sortPriority.length > 0) {
      sortPriority.forEach(sortType => {
        switch (sortType) {
          case 'terbaru': orderClauses.push('j.created_at DESC'); break;
          case 'kuota': orderClauses.push('j.positions_available DESC'); break;
          case 'pelamar_terbanyak': orderClauses.push('j.applicants_count DESC'); break;
          case 'pelamar_tersedikit': orderClauses.push('j.applicants_count ASC'); break;
          case 'deadline_terdekat': orderClauses.push('j.deadline ASC NULLS LAST'); break;
        }
      });
    }
    if (orderClauses.length === 0) {
      orderClauses.push('j.created_at DESC');
    }

    let dataQuery = `
      SELECT 
        j.id, j.title, j.department, j.employment_type, j.work_arrangement, j.experience_level, 
        j.salary_min, j.salary_max, j.salary_currency, j.deadline, j.positions_available, 
        j.is_paid, j.duration_min, j.duration_max, j.duration_unit, j.created_at,
        c.name as company_name, c.logo_url as company_logo, c.slug as company_slug,
        (SELECT name FROM company_locations WHERE company_id = c.id AND is_headquarters = true LIMIT 1) as location,
        COALESCE(j.applicants_count, 0) as applicants_count
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      ${whereString}
      ORDER BY ${orderClauses.join(', ')}
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    const dataValues = [...values, pagination.limit, pagination.offset];
    const { rows: jobs } = await db.query(dataQuery, dataValues);

    return { jobs, totalCount };
  }

  async getJobDetail(jobId) {
    const query = `
      SELECT 
        j.*,
        c.name as company_name, c.logo_url as company_logo, c.slug as company_slug, c.industry as company_industry,
        (SELECT name FROM company_locations WHERE company_id = c.id AND is_headquarters = true LIMIT 1) as location
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.id = $1 AND j.status = 'published'
    `;
    const res = await db.query(query, [jobId]);
    const job = res.rows[0];

    if (job) {
      const qQuery = `SELECT * FROM job_custom_questions WHERE job_id = $1 ORDER BY order_index ASC`;
      const qRes = await db.query(qQuery, [jobId]);
      job.custom_questions = qRes.rows;
    }

    return job;
  }
}

module.exports = new PublicJobRepository();
