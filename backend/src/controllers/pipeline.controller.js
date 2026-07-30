const pipelineService = require('../services/pipeline.service');

class PipelineController {
  async getPipeline(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const { jobId } = req.params;
      
      const pipelineData = await pipelineService.getPipeline(companyId, jobId);
      res.json({ success: true, data: pipelineData });
    } catch (err) {
      next(err);
    }
  }

  async moveStage(req, res, next) {
    try {
      const companyId = req.user.companyId;
      const actorId = req.user.id;
      const { id: applicationId } = req.params;
      const { newStageId } = req.body;
      
      if (!newStageId) {
        return res.status(400).json({ success: false, message: 'newStageId is required' });
      }

      const updatedApp = await pipelineService.moveStage(companyId, applicationId, newStageId, actorId);
      res.json({ success: true, data: updatedApp, message: 'Application stage updated successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PipelineController();
