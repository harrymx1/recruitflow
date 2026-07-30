const hrEmailTemplatesRepository = require('../repositories/hr.emailTemplates.repository');

class HREmailTemplatesController {
  async getTemplate(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { type } = req.params;
      
      if (!['offer', 'reject'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Type harus offer atau reject' });
      }

      const template = await hrEmailTemplatesRepository.getTemplate(companyId, type);
      res.json({ success: true, data: template });
    } catch (err) {
      next(err);
    }
  }

  async saveTemplate(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { type } = req.params;
      const { subject, body } = req.body;
      
      if (!['offer', 'reject'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Type harus offer atau reject' });
      }

      if (!subject || !body) {
        return res.status(400).json({ success: false, message: 'Subject dan body wajib diisi' });
      }

      const template = await hrEmailTemplatesRepository.saveTemplate(companyId, type, subject, body);
      res.json({ success: true, message: 'Template berhasil disimpan', data: template });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HREmailTemplatesController();
