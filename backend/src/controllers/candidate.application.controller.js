const candidateApplicationRepository = require('../repositories/candidate.application.repository');

class CandidateApplicationController {
  async applyForJob(req, res, next) {
    try {
      const candidateId = req.candidate.id; // from auth middleware
      const { jobId } = req.params;
      if (!req.body.documents || req.body.documents.length === 0) {
        return res.status(400).json({ success: false, message: 'Dokumen CV/resume wajib disertakan' });
      }
      const data = { ...req.body, job_id: jobId };

      const result = await candidateApplicationRepository.applyForJob(candidateId, data);
      res.status(201).json({ success: true, message: 'Lamaran berhasil dikirim', data: result });
    } catch (err) {
      if (err.message === 'Anda sudah melamar pekerjaan ini') {
        return res.status(400).json({ success: false, message: err.message });
      }
      next(err);
    }
  }

  async getApplications(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const applications = await candidateApplicationRepository.getApplications(candidateId);
      res.json({ success: true, data: applications });
    } catch (err) {
      next(err);
    }
  }

  async getApplicationById(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const { id } = req.params;
      const application = await candidateApplicationRepository.getApplicationById(id, candidateId);
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Aplikasi tidak ditemukan' });
      }
      
      res.json({ success: true, data: application });
    } catch (err) {
      next(err);
    }
  }

  async withdrawApplication(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const { id } = req.params;
      await candidateApplicationRepository.withdrawApplication(id, candidateId);
      res.json({ success: true, message: 'Lamaran berhasil ditarik' });
    } catch (err) {
      if (err.message === 'Aplikasi tidak ditemukan atau tidak dapat ditarik') {
        return res.status(400).json({ success: false, message: err.message });
      }
      next(err);
    }
  }
}

module.exports = new CandidateApplicationController();
