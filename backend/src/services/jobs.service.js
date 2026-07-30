const jobRepository = require('../repositories/job.repository');
const companyRepository = require('../repositories/company.repository');

class JobsService {
  async getJobs(companyId) {
    return await jobRepository.getJobsByCompanyId(companyId);
  }

  async getJobById(companyId, jobId) {
    const job = await jobRepository.getJobById(companyId, jobId);
    if (!job) {
      const err = new Error('Job not found');
      err.statusCode = 404;
      throw err;
    }
    // Fetch related
    job.custom_questions = await jobRepository.getCustomQuestions(jobId);
    job.pipeline_stages = await jobRepository.getPipelineStages(jobId);
    
    return job;
  }

  async createJob(companyId, jobData) {
    if (jobData.is_published) {
      const company = await companyRepository.getCompanyById(companyId);
      if (!company || !company.is_profile_complete) {
        const err = new Error('Company profile must be complete to publish a job');
        err.statusCode = 400;
        throw err;
      }
      if (company.subscription_tier === 'starter') {
        const activeJobs = await jobRepository.getJobsByCompanyId(companyId);
        const publishedCount = activeJobs.filter(j => j.is_published && j.status !== 'closed').length;
        if (publishedCount >= 1) {
          const err = new Error('Paket Starter hanya mengizinkan 1 lowongan aktif. Silakan upgrade ke paket Growth.');
          err.statusCode = 403;
          throw err;
        }
      }
    }

    jobData.company_id = companyId;
    return await jobRepository.createJob(jobData);
  }

  async updateJob(companyId, jobId, updateData) {
    const allowedFields = [
      'title', 'department', 'location_id', 'employment_type', 
      'experience_level', 'description', 'requirements', 'responsibilities', 
      'is_paid', 'salary_min', 'salary_max', 'salary_currency', 'work_arrangement', 
      'duration_min', 'duration_max', 'duration_unit',
      'status', 'is_published', 'deadline', 'positions_available'
    ];
    
    const dataToUpdate = {};
    for (const key of Object.keys(updateData)) {
      if (allowedFields.includes(key)) {
        dataToUpdate[key] = updateData[key];
      }
    }

    if (dataToUpdate.is_published) {
      const company = await companyRepository.getCompanyById(companyId);
      if (!company || !company.is_profile_complete) {
        const err = new Error('Company profile must be complete to publish a job');
        err.statusCode = 400;
        throw err;
      }
      
      const currentJob = await jobRepository.getJobById(companyId, jobId);
      if (!currentJob.is_published || currentJob.status === 'closed') {
        if (company.subscription_tier === 'starter') {
          const activeJobs = await jobRepository.getJobsByCompanyId(companyId);
          const publishedCount = activeJobs.filter(j => j.is_published && j.status !== 'closed' && j.id !== jobId).length;
          if (publishedCount >= 1) {
            const err = new Error('Paket Starter hanya mengizinkan 1 lowongan aktif. Silakan upgrade ke paket Growth.');
            err.statusCode = 403;
            throw err;
          }
        }
      }

      dataToUpdate.published_at = new Date();
    }

    const updatedJob = await jobRepository.updateJob(companyId, jobId, dataToUpdate);
    if (!updatedJob) {
      const err = new Error('Job not found');
      err.statusCode = 404;
      throw err;
    }
    return updatedJob;
  }

  async deleteJob(companyId, jobId) {
    const deleted = await jobRepository.deleteJob(companyId, jobId);
    if (!deleted) {
      const err = new Error('Job not found');
      err.statusCode = 404;
      throw err;
    }
  }

  // --- Custom Questions ---
  async getCustomQuestions(jobId) {
    return await jobRepository.getCustomQuestions(jobId);
  }

  async saveCustomQuestions(companyId, jobId, questions) {
    const job = await jobRepository.getJobById(companyId, jobId);
    if (!job) {
      const err = new Error('Job not found');
      err.statusCode = 404;
      throw err;
    }
    return await jobRepository.saveCustomQuestions(jobId, questions);
  }

  // --- Pipeline Stages ---
  async getPipelineStages(jobId) {
    return await jobRepository.getPipelineStages(jobId);
  }

  async savePipelineStages(companyId, jobId, stages) {
    const job = await jobRepository.getJobById(companyId, jobId);
    if (!job) {
      const err = new Error('Job not found');
      err.statusCode = 404;
      throw err;
    }

    const anchorTypes = stages.filter(s => s.type === 'anchor').map(s => s.name.toLowerCase());
    const requiredAnchors = ['applied', 'hired', 'rejected'];
    for (const req of requiredAnchors) {
      if (!anchorTypes.includes(req)) {
        const err = new Error(`Pipeline must contain anchor stage: ${req}`);
        err.statusCode = 400;
        throw err;
      }
    }

    return await jobRepository.savePipelineStages(jobId, stages);
  }
}

module.exports = new JobsService();
