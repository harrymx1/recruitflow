const db = require('../config/db');

class SubscriptionsRepository {
  async updateCompanySubscription(companyId, tier, expiresAt) {
    const query = `
      UPDATE companies
      SET subscription_tier = $1, subscription_expires_at = $2
      WHERE id = $3
      RETURNING id, name, subscription_tier, subscription_expires_at
    `;
    const res = await db.query(query, [tier, expiresAt, companyId]);
    return res.rows[0];
  }

  async getCompanySubscription(companyId) {
    const query = `
      SELECT subscription_tier, subscription_expires_at 
      FROM companies 
      WHERE id = $1
    `;
    const res = await db.query(query, [companyId]);
    return res.rows[0];
  }

  async updateCandidateSubscription(candidateId, tier, expiresAt) {
    const query = `
      UPDATE candidates
      SET subscription_tier = $1, subscription_expires_at = $2
      WHERE id = $3
      RETURNING id, email, subscription_tier, subscription_expires_at
    `;
    const res = await db.query(query, [tier, expiresAt, candidateId]);
    return res.rows[0];
  }

  async getCandidateSubscription(candidateId) {
    const query = `
      SELECT subscription_tier, subscription_expires_at 
      FROM candidates 
      WHERE id = $1
    `;
    const res = await db.query(query, [candidateId]);
    return res.rows[0];
  }
}

module.exports = new SubscriptionsRepository();
