const publicJobRepository = require('../repositories/public.job.repository');

class PublicJobsController {
  async searchJobs(req, res, next) {
    try {
      const {
        keyword,
        employment_type,
        work_arrangement,
        experience_level,
        company_id,
        sort_priority,
        page = 1,
        limit = 10
      } = req.query;

      const filters = {
        keyword,
        employment_type: employment_type ? employment_type.split(',') : [],
        work_arrangement: work_arrangement ? work_arrangement.split(',') : [],
        experience_level: experience_level ? experience_level.split(',') : [],
        company_id
      };

      const sortPriority = sort_priority ? sort_priority.split(',') : [];
      const pagination = {
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10)
      };

      const result = await publicJobRepository.searchJobs(filters, sortPriority, pagination);
      
      res.json({
        success: true,
        data: result.jobs,
        pagination: {
          total: result.totalCount,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: Math.ceil(result.totalCount / parseInt(limit, 10))
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async getJobDetail(req, res, next) {
    try {
      const job = await publicJobRepository.getJobDetail(req.params.jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found or not published' });
      }
      res.json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PublicJobsController();
