const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipeline.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');

router.use(authenticateCompany);

router.get('/jobs/:jobId/pipeline', pipelineController.getPipeline);
router.patch('/applications/:id/stage', pipelineController.moveStage);

module.exports = router;
