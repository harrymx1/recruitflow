const companiesService = require('../services/companies.service');

class CompaniesController {
  async inviteTeamMember(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const result = await companiesService.inviteTeamMember(companyId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async toggleMemberStatus(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { memberId } = req.params;
      const { isActive } = req.body;
      
      const result = await companiesService.toggleMemberStatus(companyId, memberId, isActive);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getTeamMembers(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const members = await companiesService.getTeamMembers(companyId);
      res.status(200).json({ success: true, data: members });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const profile = await companiesService.getProfile(companyId);
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  async getPublicProfile(req, res, next) {
    try {
      const { slug } = req.params;
      const profile = await companiesService.getPublicProfile(slug);
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const updatedProfile = await companiesService.updateProfile(companyId, req.body);
      res.status(200).json({ success: true, data: updatedProfile });
    } catch (err) {
      next(err);
    }
  }

  async getLocations(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const locations = await companiesService.getLocations(companyId);
      res.status(200).json({ success: true, data: locations });
    } catch (err) {
      next(err);
    }
  }

  async addLocation(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const location = await companiesService.addLocation(companyId, req.body);
      res.status(201).json({ success: true, data: location });
    } catch (err) {
      next(err);
    }
  }

  async removeLocation(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { locationId } = req.params;
      await companiesService.removeLocation(companyId, locationId);
      res.status(200).json({ success: true, message: 'Location removed' });
    } catch (err) {
      next(err);
    }
  }

  async setHeadquarters(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { locationId } = req.params;
      const location = await companiesService.setHeadquarters(companyId, locationId);
      res.status(200).json({ success: true, data: location });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CompaniesController();
