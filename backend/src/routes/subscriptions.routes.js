const express = require('express');
const router = express.Router();
const subscriptionsController = require('../controllers/subscriptions.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');
const authenticateCandidate = require('../middlewares/authenticateCandidate');

// Company subscription routes
router.post('/company/upgrade', authenticateCompany, subscriptionsController.upgradeCompany);

// Candidate subscription routes
router.post('/candidate/upgrade', authenticateCandidate, subscriptionsController.upgradeCandidate);

// Status route for general checking (if needed, but usually handled via auth payload/profile fetch)
router.get('/company/status', authenticateCompany, subscriptionsController.getCompanyStatus);
router.get('/candidate/status', authenticateCandidate, subscriptionsController.getCandidateStatus);

module.exports = router;
