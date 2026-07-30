const express = require('express');
const router = express.Router();
const publicJobsController = require('../controllers/public.jobs.controller');

router.get('/', publicJobsController.searchJobs);
router.get('/:jobId', publicJobsController.getJobDetail);

module.exports = router;
