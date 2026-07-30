const hrCandidatesRepository = require('../repositories/hr.candidates.repository');

class HRCandidatesController {
  async getAllCandidates(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const filters = {
        search: req.query.search,
        status: req.query.status
      };
      const candidates = await hrCandidatesRepository.getAllCandidates(companyId, filters);
      res.json({ success: true, data: candidates });
    } catch (err) {
      next(err);
    }
  }

  async getApplicationDetail(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { id } = req.params;
      const application = await hrCandidatesRepository.getApplicationDetail(id, companyId);
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Aplikasi tidak ditemukan' });
      }
      
      res.json({ success: true, data: application });
    } catch (err) {
      next(err);
    }
  }

  async makeDecision(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { id } = req.params;
      const { status, sendEmail, emailSubject, emailBody } = req.body;

      if (!['hired', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Status harus hired atau rejected' });
      }

      const updatedApp = await hrCandidatesRepository.updateDecision(id, companyId, status);

      // In a real application, send the email here using Nodemailer or an API like SendGrid/Mailgun.
      // For this implementation, if sendEmail is true, we will just log it to the console (simulated)
      if (sendEmail) {
        console.log(`[EMAIL SIMULATION] Sending ${status} email to candidate of application ${id}`);
        console.log(`Subject: ${emailSubject}`);
        console.log(`Body:\n${emailBody}`);
        
        // Also log to email_send_log (using a quick direct query or repository)
        const db = require('../config/db');
        await db.query(`
          INSERT INTO email_send_log (company_id, application_id, type, recipient_email, subject, body)
          VALUES ($1, $2, $3, (SELECT email FROM candidates c JOIN applications a ON c.id = a.candidate_id WHERE a.id = $2), $4, $5)
        `, [companyId, id, status === 'hired' ? 'offer' : 'reject', emailSubject, emailBody]);
      }

      res.json({ success: true, message: `Status kandidat berhasil diubah menjadi ${status}`, data: updatedApp });
    } catch (err) {
      if (err.message === 'Aplikasi tidak ditemukan' || err.message === 'Tidak dapat mengubah status aplikasi yang telah ditarik oleh kandidat') {
        return res.status(400).json({ success: false, message: err.message });
      }
      next(err);
    }
  }
}

module.exports = new HRCandidatesController();
