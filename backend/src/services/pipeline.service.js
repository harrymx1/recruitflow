const pipelineRepository = require('../repositories/pipeline.repository');
const jobRepository = require('../repositories/job.repository');

class PipelineService {
  async getPipeline(companyId, jobId) {
    // Verify job belongs to company
    const job = await jobRepository.getJobById(companyId, jobId);
    if (!job) {
      const err = new Error('Job not found or unauthorized');
      err.statusCode = 404;
      throw err;
    }

    const stages = await pipelineRepository.getPipelineStages(jobId);
    const applications = await pipelineRepository.getApplicationsByJobId(jobId);

    return { stages, applications };
  }

  async moveStage(companyId, applicationId, newStageId, actorId) {
    const application = await pipelineRepository.getApplicationById(applicationId);
    if (!application) {
      const err = new Error('Application not found');
      err.statusCode = 404;
      throw err;
    }

    // Verify job belongs to company
    const job = await jobRepository.getJobById(companyId, application.job_id);
    if (!job) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    const stages = await pipelineRepository.getPipelineStages(job.id);
    const targetStage = stages.find(s => s.id === newStageId);
    
    // Status Logic based on Anchor Type
    // If target stage is 'hired', we update application status to 'hired'
    // If target stage is 'rejected', we update application status to 'rejected'
    // If target stage is 'withdrawn', we shouldn't allow HR to move it there usually (only candidate), but we can handle it if needed.
    // Otherwise, status remains 'active'
    
    let newStatus = 'active';
    if (targetStage) {
      if (targetStage.anchor_type === 'anchor') {
        const stageName = targetStage.name.toLowerCase();
        if (stageName === 'withdrawn') {
           const err = new Error('HR tidak diizinkan mengubah status menjadi Withdrawn');
           err.statusCode = 400;
           throw err;
        }
        if (stageName === 'hired') newStatus = 'hired';
        if (stageName === 'rejected') newStatus = 'rejected';
      }
    } else {
       const err = new Error('Target stage is invalid');
       err.statusCode = 400;
       throw err;
    }

    // Handle Quota for Hired
    if (newStatus === 'hired') {
      try {
        await pipelineRepository.incrementFilledCount(job.id);
      } catch (err) {
        if (err.message.includes('Overbooked')) {
           const quotaErr = new Error('Kuota posisi ini sudah penuh.');
           quotaErr.statusCode = 400;
           throw quotaErr;
        }
        throw err;
      }
    }

    // Update Application Stage
    const updatedApp = await pipelineRepository.updateApplicationStage(applicationId, newStageId);
    
    // Update Application Status if changed
    if (newStatus !== application.status) {
      await pipelineRepository.updateApplicationStatus(applicationId, newStatus);
      updatedApp.status = newStatus;

      if (newStatus === 'hired') {
        const currentHiredCount = await pipelineRepository.getHiredCountByJobId(job.id);
        if (job.positions_available && currentHiredCount >= job.positions_available) {
          await jobRepository.updateJob(companyId, job.id, { status: 'closed' });
        }
      }
    }

    // Log Activity
    const oldStage = stages.find(s => s.id === application.current_stage_id);
    const stageNameFrom = oldStage ? oldStage.name : 'Unknown';
    const stageNameTo = targetStage.name;
    
    await pipelineRepository.logActivity(
      applicationId, 
      'company_member', 
      actorId, 
      'stage_moved', 
      `Dipindahkan dari tahap ${stageNameFrom} ke ${stageNameTo}`
    );

    return updatedApp;
  }
}

module.exports = new PipelineService();
