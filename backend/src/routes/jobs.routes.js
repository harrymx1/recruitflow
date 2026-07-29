const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');
const requireRole = require('../middlewares/requireRole');

// All jobs routes are protected for HR/Admin
router.use(authenticateCompany);

router.get('/', jobsController.getJobs);
router.post('/', requireRole('admin', 'hr'), jobsController.createJob);
router.get('/:id', jobsController.getJobById);
router.put('/:id', requireRole('admin', 'hr'), jobsController.updateJob);
router.delete('/:id', requireRole('admin', 'hr'), jobsController.deleteJob);

// Custom Questions
router.get('/:id/questions', jobsController.getCustomQuestions);
router.put('/:id/questions', requireRole('admin', 'hr'), jobsController.saveCustomQuestions);

// Pipeline Stages
router.get('/:id/stages', jobsController.getPipelineStages);
router.put('/:id/stages', requireRole('admin', 'hr'), jobsController.savePipelineStages);

module.exports = router;
