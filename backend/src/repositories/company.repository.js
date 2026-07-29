const db = require('../config/db');

class CompanyRepository {
  async createCompany(companyData) {
    const { name, slug, email, passwordHash } = companyData;
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      const insertCompanyText = `
        INSERT INTO companies (name, slug)
        VALUES ($1, $2)
        RETURNING id;
      `;
      const companyRes = await client.query(insertCompanyText, [name, slug]);
      const companyId = companyRes.rows[0].id;
      
      const insertMemberText = `
        INSERT INTO company_members (company_id, name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, 'admin')
        RETURNING id;
      `;
      // By default the creator is the admin and has the same name as company or a default 'Admin'
      // The design says company register + admin account.
      // So companyData should include adminName.
      await client.query(insertMemberText, [companyId, companyData.adminName || 'Admin', email, passwordHash]);
      
      await client.query('COMMIT');
      return companyId;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getCompanyBySlug(slug) {
    const res = await db.query('SELECT * FROM companies WHERE slug = $1', [slug]);
    return res.rows[0];
  }

  async getLocations(companyId) {
    const res = await db.query('SELECT * FROM company_locations WHERE company_id = $1 ORDER BY is_headquarters DESC, id ASC', [companyId]);
    return res.rows;
  }

  async addLocation(companyId, data) {
    const { city, province, country, is_headquarters } = data;
    const res = await db.query(
      'INSERT INTO company_locations (company_id, city, province, country, is_headquarters) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [companyId, city, province, country, is_headquarters || false]
    );
    return res.rows[0];
  }

  async removeLocation(companyId, locationId) {
    const res = await db.query('DELETE FROM company_locations WHERE id = $1 AND company_id = $2 RETURNING id', [locationId, companyId]);
    return res.rowCount > 0;
  }

  async setHeadquarters(companyId, locationId) {
    await db.query('UPDATE company_locations SET is_headquarters = false WHERE company_id = $1', [companyId]);
    const res = await db.query('UPDATE company_locations SET is_headquarters = true WHERE id = $1 AND company_id = $2 RETURNING *', [locationId, companyId]);
    return res.rows[0];
  }

  async getCompanyById(id) {
    const res = await db.query('SELECT * FROM companies WHERE id = $1', [id]);
    return res.rows[0];
  }

  async updateCompany(id, updateData) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(updateData)) {
      // Assuming keys match snake_case columns if converted, wait let's be explicit
      // We'll trust the service to pass valid snake_case keys
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE companies 
      SET ${fields.join(', ')} 
      WHERE id = $${idx}
      RETURNING *
    `;

    const res = await db.query(query, values);
    return res.rows[0];
  }

  async getMemberByEmail(email) {
    const res = await db.query('SELECT * FROM company_members WHERE email = $1', [email]);
    return res.rows[0];
  }

  async getMemberById(id) {
    const res = await db.query('SELECT * FROM company_members WHERE id = $1', [id]);
    return res.rows[0];
  }
  
  async getMembersByCompanyId(companyId) {
    const res = await db.query('SELECT id, name, email, role, is_active, created_at FROM company_members WHERE company_id = $1', [companyId]);
    return res.rows;
  }
  
  async updateMemberStatus(companyId, memberId, isActive) {
    const res = await db.query(
      'UPDATE company_members SET is_active = $1 WHERE id = $2 AND company_id = $3 RETURNING id',
      [isActive, memberId, companyId]
    );
    return res.rows[0];
  }
  
  async addTeamMember(companyId, memberData) {
    const { name, email, passwordHash, role } = memberData;
    const res = await db.query(
      'INSERT INTO company_members (company_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [companyId, name, email, passwordHash, role]
    );
    return res.rows[0].id;
  }

  async storeRefreshToken(userId, tokenHash, expiresAt, type) {
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, type) VALUES ($1, $2, $3, $4)',
      [userId, tokenHash, expiresAt, type]
    );
  }

  async revokeRefreshToken(tokenHash) {
    await db.query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [tokenHash]);
  }

  async checkRefreshToken(tokenHash) {
    const res = await db.query('SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked = false AND expires_at > NOW()', [tokenHash]);
    return res.rows[0];
  }

  async updateMemberPassword(memberId, passwordHash) {
    const query = `
      UPDATE company_members
      SET password_hash = $1
      WHERE id = $2
    `;
    await db.query(query, [passwordHash, memberId]);
  }
}

module.exports = new CompanyRepository();
