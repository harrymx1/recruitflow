const hrNotesRepository = require('../repositories/hr.notes.repository');

class HRNotesController {
  async getNotes(req, res, next) {
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

      const notes = await hrNotesRepository.getNotes(id);
      res.json({ success: true, data: notes });
    } catch (err) {
      next(err);
    }
  }

  async addNote(req, res, next) {
    try {
      const { id } = req.params; // application id
      const companyId = req.user.companyId;
      const companyMemberId = req.user.id;
      const { note_text } = req.body;
      
      if (!note_text) {
        return res.status(400).json({ success: false, message: 'Teks catatan diperlukan' });
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

      const newNote = await hrNotesRepository.addNote(id, companyMemberId, note_text);
      res.status(201).json({ success: true, data: newNote, message: 'Catatan berhasil ditambahkan' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HRNotesController();
