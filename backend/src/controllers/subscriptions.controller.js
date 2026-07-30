const subscriptionsRepository = require('../repositories/subscriptions.repository');

class SubscriptionsController {
  // Simulate a payment integration for company upgrade
  async upgradeCompany(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { plan_type, billing_cycle } = req.body;
      
      // Basic validation
      if (!['growth', 'enterprise'].includes(plan_type)) {
        return res.status(400).json({ success: false, message: 'Invalid plan type' });
      }

      // Calculate expiration based on simulated billing cycle
      const expiresAt = new Date();
      if (billing_cycle === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      const result = await subscriptionsRepository.updateCompanySubscription(companyId, plan_type, expiresAt);
      
      res.json({ success: true, data: result, message: 'Company subscription upgraded successfully' });
    } catch (err) {
      next(err);
    }
  }

  async getCompanyStatus(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const status = await subscriptionsRepository.getCompanySubscription(companyId);
      res.json({ success: true, data: status });
    } catch (err) {
      next(err);
    }
  }

  // Simulate a payment integration for candidate upgrade
  async upgradeCandidate(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const { plan_type, billing_cycle } = req.body; // usually 'premium'
      
      if (plan_type !== 'premium') {
        return res.status(400).json({ success: false, message: 'Invalid plan type' });
      }

      const expiresAt = new Date();
      if (billing_cycle === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      const result = await subscriptionsRepository.updateCandidateSubscription(candidateId, plan_type, expiresAt);
      
      res.json({ success: true, data: result, message: 'Candidate subscription upgraded successfully' });
    } catch (err) {
      next(err);
    }
  }

  async getCandidateStatus(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const status = await subscriptionsRepository.getCandidateSubscription(candidateId);
      res.json({ success: true, data: status });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SubscriptionsController();
