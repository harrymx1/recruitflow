const analyticsRepository = require('../repositories/analytics.repository');

class AnalyticsController {
  async getSummary(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const data = await analyticsRepository.getSummary(companyId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getFunnel(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const data = await analyticsRepository.getFunnel(companyId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async getSource(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const data = await analyticsRepository.getSource(companyId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
  async getTimeToHire(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const data = await analyticsRepository.getTimeToHire(companyId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnalyticsController();
