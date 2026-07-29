const jobsService = require('../services/jobs.service');

class JobsController {
  async getJobs(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const jobs = await jobsService.getJobs(companyId);
      res.status(200).json({ success: true, data: jobs });
    } catch (err) {
      next(err);
    }
  }

  async getJobById(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { id } = req.params;
      const job = await jobsService.getJobById(companyId, id);
      res.status(200).json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  }

  async createJob(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const job = await jobsService.createJob(companyId, req.body);
      res.status(201).json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  }

  async updateJob(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { id } = req.params;
      const job = await jobsService.updateJob(companyId, id, req.body);
      res.status(200).json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  }

  async deleteJob(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { id } = req.params;
      await jobsService.deleteJob(companyId, id);
      res.status(200).json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  // --- Custom Questions ---
  async getCustomQuestions(req, res, next) {
    try {
      const questions = await jobsService.getCustomQuestions(req.params.id);
      res.status(200).json({ success: true, data: questions });
    } catch (err) {
      next(err);
    }
  }

  async saveCustomQuestions(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const questions = await jobsService.saveCustomQuestions(companyId, req.params.id, req.body.questions || []);
      res.status(200).json({ success: true, data: questions });
    } catch (err) {
      next(err);
    }
  }

  // --- Pipeline Stages ---
  async getPipelineStages(req, res, next) {
    try {
      const stages = await jobsService.getPipelineStages(req.params.id);
      res.status(200).json({ success: true, data: stages });
    } catch (err) {
      next(err);
    }
  }

  async savePipelineStages(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const stages = await jobsService.savePipelineStages(companyId, req.params.id, req.body.stages || []);
      res.status(200).json({ success: true, data: stages });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new JobsController();
