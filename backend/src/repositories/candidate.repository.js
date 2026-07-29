const db = require('../config/db');

class CandidateRepository {
  async createCandidate(email, passwordHash) {
    const res = await db.query(
      'INSERT INTO candidates (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, passwordHash]
    );
    return res.rows[0].id;
  }

  async getCandidateByEmail(email) {
    const res = await db.query('SELECT * FROM candidates WHERE email = $1', [email]);
    return res.rows[0];
  }

  async getCandidateById(id) {
    const res = await db.query('SELECT * FROM candidates WHERE id = $1', [id]);
    return res.rows[0];
  }

  async storeRefreshToken(userId, tokenHash, expiresAt) {
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, type) VALUES ($1, $2, $3, $4)',
      [userId, tokenHash, expiresAt, 'candidate']
    );
  }

  async revokeRefreshToken(tokenHash) {
    await db.query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [tokenHash]);
  }

  async checkRefreshToken(tokenHash) {
    const res = await db.query('SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked = false AND expires_at > NOW()', [tokenHash]);
    return res.rows[0];
  }

  async updateCandidatePassword(candidateId, passwordHash) {
    const query = `
      UPDATE candidates
      SET password_hash = $1
      WHERE id = $2
    `;
    await db.query(query, [passwordHash, candidateId]);
  }
}

module.exports = new CandidateRepository();
