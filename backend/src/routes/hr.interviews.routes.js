const express = require('express');
const router = express.Router();
const hrInterviewsController = require('../controllers/hr.interviews.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');

router.get('/', authenticateCompany, hrInterviewsController.getInterviews);
router.post('/applications/:id', authenticateCompany, hrInterviewsController.scheduleInterview);
router.put('/:interviewId', authenticateCompany, hrInterviewsController.updateInterview);
router.delete('/:interviewId', authenticateCompany, hrInterviewsController.cancelInterview);

module.exports = router;
