const db = require('../config/db');

class CandidateProfileRepository {
  async getProfile(candidateId) {
    const queries = {
      profile: 'SELECT * FROM candidate_profiles WHERE candidate_id = $1',
      experiences: 'SELECT * FROM candidate_experiences WHERE candidate_id = $1 ORDER BY order_index ASC',
      educations: 'SELECT * FROM candidate_educations WHERE candidate_id = $1 ORDER BY order_index ASC',
      skills: 'SELECT * FROM candidate_skills WHERE candidate_id = $1',
      certifications: 'SELECT * FROM candidate_certifications WHERE candidate_id = $1 ORDER BY order_index ASC',
      links: 'SELECT * FROM candidate_links WHERE candidate_id = $1 ORDER BY order_index ASC',
      documents: 'SELECT * FROM candidate_documents WHERE candidate_id = $1 ORDER BY created_at DESC'
    };

    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      const res = await db.query(query, [candidateId]);
      results[key] = key === 'profile' ? res.rows[0] : res.rows;
    }
    return results;
  }

  async updateBasicProfile(candidateId, data) {
    const query = `
      INSERT INTO candidate_profiles (
        candidate_id, full_name, headline, summary, phone, dob, location, salary_expectation, notice_period, photo_url
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      ON CONFLICT (candidate_id) DO UPDATE
      SET 
        full_name = EXCLUDED.full_name,
        headline = EXCLUDED.headline,
        summary = EXCLUDED.summary,
        phone = EXCLUDED.phone,
        dob = EXCLUDED.dob,
        location = EXCLUDED.location,
        salary_expectation = EXCLUDED.salary_expectation,
        notice_period = EXCLUDED.notice_period,
        photo_url = EXCLUDED.photo_url
      RETURNING *
    `;
    const values = [
      candidateId, data.full_name, data.headline, data.summary, data.phone,
      data.dob || null, data.location, data.salary_expectation || null, data.notice_period, data.photo_url
    ];
    const res = await db.query(query, values);
    return res.rows[0];
  }

  async syncArrayEntities(candidateId, tableName, items) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      const { rows: existingRows } = await client.query(`SELECT id FROM ${tableName} WHERE candidate_id = $1`, [candidateId]);
      const existingIds = existingRows.map(r => r.id);
      const incomingIds = items.filter(i => i.id).map(i => i.id);
      
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      if (idsToDelete.length > 0) {
        await client.query(`DELETE FROM ${tableName} WHERE id = ANY($1::uuid[])`, [idsToDelete]);
      }

      const upserted = [];
      for (const [index, item] of items.entries()) {
        if (tableName === 'candidate_experiences') {
          if (item.id) {
            const res = await client.query(
              `UPDATE candidate_experiences SET company_name=$1, position=$2, start_date=$3, end_date=$4, is_current=$5, description=$6, order_index=$7 WHERE id=$8 RETURNING *`,
              [item.company_name, item.position, item.start_date, item.end_date, item.is_current, item.description, index, item.id]
            );
            upserted.push(res.rows[0]);
          } else {
            const res = await client.query(
              `INSERT INTO candidate_experiences (candidate_id, company_name, position, start_date, end_date, is_current, description, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
              [candidateId, item.company_name, item.position, item.start_date, item.end_date, item.is_current, item.description, index]
            );
            upserted.push(res.rows[0]);
          }
        } else if (tableName === 'candidate_educations') {
          if (item.id) {
            const res = await client.query(
              `UPDATE candidate_educations SET institution=$1, degree=$2, major=$3, start_year=$4, end_year=$5, order_index=$6 WHERE id=$7 RETURNING *`,
              [item.institution, item.degree, item.major, item.start_year, item.end_year, index, item.id]
            );
            upserted.push(res.rows[0]);
          } else {
            const res = await client.query(
              `INSERT INTO candidate_educations (candidate_id, institution, degree, major, start_year, end_year, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
              [candidateId, item.institution, item.degree, item.major, item.start_year, item.end_year, index]
            );
            upserted.push(res.rows[0]);
          }
        } else if (tableName === 'candidate_certifications') {
          if (item.id) {
            const res = await client.query(
              `UPDATE candidate_certifications SET name=$1, issuer=$2, year=$3, order_index=$4 WHERE id=$5 RETURNING *`,
              [item.name, item.issuer, item.year, index, item.id]
            );
            upserted.push(res.rows[0]);
          } else {
            const res = await client.query(
              `INSERT INTO candidate_certifications (candidate_id, name, issuer, year, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
              [candidateId, item.name, item.issuer, item.year, index]
            );
            upserted.push(res.rows[0]);
          }
        } else if (tableName === 'candidate_links') {
          if (item.id) {
            const res = await client.query(
              `UPDATE candidate_links SET url_label=$1, url=$2, order_index=$3 WHERE id=$4 RETURNING *`,
              [item.url_label, item.url, index, item.id]
            );
            upserted.push(res.rows[0]);
          } else {
            const res = await client.query(
              `INSERT INTO candidate_links (candidate_id, url_label, url, order_index) VALUES ($1, $2, $3, $4) RETURNING *`,
              [candidateId, item.url_label, item.url, index]
            );
            upserted.push(res.rows[0]);
          }
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

  async updateSkills(candidateId, skills) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM candidate_skills WHERE candidate_id = $1', [candidateId]);
      
      const inserted = [];
      for (const skill of skills) {
        const res = await client.query(
          'INSERT INTO candidate_skills (candidate_id, skill_name) VALUES ($1, $2) RETURNING *',
          [candidateId, skill.skill_name || skill]
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

  async addDocument(candidateId, label, fileUrl) {
    const res = await db.query(
      'INSERT INTO candidate_documents (candidate_id, label, file_url) VALUES ($1, $2, $3) RETURNING *',
      [candidateId, label, fileUrl]
    );
    return res.rows[0];
  }

  async removeDocument(candidateId, documentId) {
    const res = await db.query(
      'DELETE FROM candidate_documents WHERE id = $1 AND candidate_id = $2 RETURNING *',
      [documentId, candidateId]
    );
    return res.rows[0];
  }
}

module.exports = new CandidateProfileRepository();
