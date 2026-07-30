const hrTagsRepository = require('../repositories/hr.tags.repository');

class HRTagsController {
  async getTags(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const tags = await hrTagsRepository.getTags(companyId);
      res.json({ success: true, data: tags });
    } catch (err) {
      next(err);
    }
  }

  async createTag(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const data = req.body;
      const tag = await hrTagsRepository.createTag(companyId, data);
      res.status(201).json({ success: true, data: tag });
    } catch (err) {
      next(err);
    }
  }

  async assignTag(req, res, next) {
    try {
      const { id } = req.params; // application_id
      const { tagId } = req.body;
      await hrTagsRepository.assignTag(id, tagId);
      res.json({ success: true, message: 'Tag berhasil ditambahkan' });
    } catch (err) {
      next(err);
    }
  }

  async removeTag(req, res, next) {
    try {
      const { id, tagId } = req.params;
      await hrTagsRepository.removeTag(id, tagId);
      res.json({ success: true, message: 'Tag berhasil dihapus' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HRTagsController();
