const hrScoresRepository = require('../repositories/hr.scores.repository');

class HRScoresController {
  async getScores(req, res, next) {
    try {
      const { id } = req.params; // application id
      const companyId = req.user.companyId;

      const db = require('../config/db');
      const checkRes = await db.query(`
        SELECT a.id FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.id = $1 AND j.company_id = $2
      `, [id, companyId]);

      if (checkRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Aplikasi tidak ditemukan' });
      }

      const data = await hrScoresRepository.getScores(id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async upsertScore(req, res, next) {
    try {
      const { id } = req.params; // application id
      const companyId = req.user.companyId;
      const companyMemberId = req.user.id;
      const { score } = req.body;
      
      if (!score || score < 1 || score > 5) {
        return res.status(400).json({ success: false, message: 'Skor harus antara 1 dan 5' });
      }

      const db = require('../config/db');
      const checkRes = await db.query(`
        SELECT a.id FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.id = $1 AND j.company_id = $2
      `, [id, companyId]);

      if (checkRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Aplikasi tidak ditemukan' });
      }

      const newScore = await hrScoresRepository.upsertScore(id, companyMemberId, score);
      res.json({ success: true, data: newScore, message: 'Skor berhasil disimpan' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HRScoresController();
