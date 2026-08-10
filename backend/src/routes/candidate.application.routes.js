const express = require('express');
const router = express.Router();
const candidateApplicationController = require('../controllers/candidate.application.controller');
const authenticateCandidate = require('../middlewares/authenticateCandidate');

// Apply to a job (moved to candidate.jobs.routes or handled here?)
// Since it's mounted at /api/candidate/applications, let's keep it clean
// We should probably just change how they are mounted. Let's change the routes here to not have /applications
router.post('/:jobId/apply', authenticateCandidate, candidateApplicationController.applyForJob);

// List and view applications
router.get('/', authenticateCandidate, candidateApplicationController.getApplications);
router.get('/:id', authenticateCandidate, candidateApplicationController.getApplicationById);
router.post('/:id/withdraw', authenticateCandidate, candidateApplicationController.withdrawApplication);

module.exports = router;
