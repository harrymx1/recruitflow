const hrInterviewsRepository = require('../repositories/hr.interviews.repository');

class HRInterviewsController {
  async scheduleInterview(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { id } = req.params; // application_id
      const data = req.body;

      if (data.scheduled_at) {
        const scheduledDate = new Date(data.scheduled_at);
        if (scheduledDate < new Date()) {
          return res.status(400).json({ success: false, message: 'Tanggal wawancara tidak boleh di masa lalu' });
        }
      }
      
      const interview = await hrInterviewsRepository.scheduleInterview(id, companyId, data);
      res.status(201).json({ success: true, message: 'Wawancara berhasil dijadwalkan', data: interview });
    } catch (err) {
      if (err.message === 'Aplikasi tidak valid') {
        return res.status(403).json({ success: false, message: err.message });
      }
      next(err);
    }
  }

  async getInterviews(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const interviews = await hrInterviewsRepository.getInterviews(companyId);
      res.json({ success: true, data: interviews });
    } catch (err) {
      next(err);
    }
  }

  async updateInterview(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { interviewId } = req.params;

      if (req.body.scheduled_at) {
        const scheduledDate = new Date(req.body.scheduled_at);
        if (scheduledDate < new Date()) {
          return res.status(400).json({ success: false, message: 'Tanggal wawancara tidak boleh di masa lalu' });
        }
      }

      const interview = await hrInterviewsRepository.updateInterview(interviewId, companyId, req.body);
      res.json({ success: true, message: 'Jadwal wawancara berhasil diperbarui', data: interview });
    } catch (err) {
      if (err.message === 'Wawancara tidak ditemukan') {
        return res.status(404).json({ success: false, message: err.message });
      }
      next(err);
    }
  }

  async cancelInterview(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { interviewId } = req.params;
      await hrInterviewsRepository.cancelInterview(interviewId, companyId);
      res.json({ success: true, message: 'Wawancara berhasil dibatalkan' });
    } catch (err) {
      if (err.message === 'Wawancara tidak ditemukan') {
        return res.status(404).json({ success: false, message: err.message });
      }
      next(err);
    }
  }
}

module.exports = new HRInterviewsController();
