const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');

router.get('/summary', authenticateCompany, analyticsController.getSummary);
router.get('/funnel', authenticateCompany, analyticsController.getFunnel);
router.get('/source', authenticateCompany, analyticsController.getSource);
router.get('/time-to-hire', authenticateCompany, analyticsController.getTimeToHire);

module.exports = router;
