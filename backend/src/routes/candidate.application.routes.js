const express = require('express');
const router = express.Router();
const candidateApplicationController = require('../controllers/candidate.application.controller');
const authenticateCandidate = require('../middlewares/authenticateCandidate');

// Apply to a job
router.post('/jobs/:jobId/apply', authenticateCandidate, candidateApplicationController.applyForJob);

// List and view applications
router.get('/applications', authenticateCandidate, candidateApplicationController.getApplications);
router.get('/applications/:id', authenticateCandidate, candidateApplicationController.getApplicationById);
router.post('/applications/:id/withdraw', authenticateCandidate, candidateApplicationController.withdrawApplication);

module.exports = router;
