const db = require('../config/db');

class HRTagsRepository {
  async getTags(companyId) {
    const query = `SELECT * FROM candidate_tags WHERE company_id = $1 ORDER BY name ASC`;
    const res = await db.query(query, [companyId]);
    return res.rows;
  }

  async createTag(companyId, data) {
    const { name, color } = data;
    const query = `
      INSERT INTO candidate_tags (company_id, name, color)
      VALUES ($1, $2, $3)
      ON CONFLICT (company_id, name) DO NOTHING
      RETURNING *
    `;
    const res = await db.query(query, [companyId, name, color || '#0d9488']);
    if (res.rows.length === 0) {
      // Must fetch the existing one if conflict
      const existRes = await db.query('SELECT * FROM candidate_tags WHERE company_id = $1 AND name = $2', [companyId, name]);
      return existRes.rows[0];
    }
    return res.rows[0];
  }

  async assignTag(applicationId, tagId) {
    const query = `
      INSERT INTO application_tags (application_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `;
    await db.query(query, [applicationId, tagId]);
  }

  async removeTag(applicationId, tagId) {
    const query = `DELETE FROM application_tags WHERE application_id = $1 AND tag_id = $2`;
    await db.query(query, [applicationId, tagId]);
  }
}

module.exports = new HRTagsRepository();
