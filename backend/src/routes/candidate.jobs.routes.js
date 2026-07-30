const express = require('express');
const router = express.Router();
const candidateJobsController = require('../controllers/candidate.jobs.controller');
const authenticateCandidate = require('../middlewares/authenticateCandidate');

router.use(authenticateCandidate);

router.get('/saved', candidateJobsController.getSavedJobs);
router.post('/:jobId/save', candidateJobsController.saveJob);
router.delete('/:jobId/save', candidateJobsController.removeSavedJob);

module.exports = router;
