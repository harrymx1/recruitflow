const db = require('../config/db');

class HRScoresRepository {
  async getScores(applicationId) {
    const query = `
      SELECT s.*, m.name as first_name, '' as last_name, m.role
      FROM candidate_scores s
      JOIN company_members m ON s.company_member_id = m.id
      WHERE s.application_id = $1
    `;
    const res = await db.query(query, [applicationId]);

    const avgQuery = `
      SELECT AVG(score) as average_score
      FROM candidate_scores
      WHERE application_id = $1
    `;
    const avgRes = await db.query(avgQuery, [applicationId]);
    
    return {
      scores: res.rows,
      average_score: avgRes.rows[0].average_score ? parseFloat(avgRes.rows[0].average_score).toFixed(1) : null
    };
  }

  async upsertScore(applicationId, companyMemberId, score) {
    const query = `
      INSERT INTO candidate_scores (application_id, company_member_id, score)
      VALUES ($1, $2, $3)
      ON CONFLICT (application_id, company_member_id)
      DO UPDATE SET score = EXCLUDED.score, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const res = await db.query(query, [applicationId, companyMemberId, score]);
    
    // Log Activity
    const activityLogsRepository = require('./activityLogs.repository');
    await activityLogsRepository.logActivity({
      application_id: applicationId,
      actor_type: 'company_member',
      actor_id: companyMemberId,
      action_type: 'Penilaian (Score) Diberikan',
      description: `HR memberikan nilai ${score}/5 untuk kandidat.`
    });

    return res.rows[0];
  }
}

module.exports = new HRScoresRepository();
