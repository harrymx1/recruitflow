const express = require('express');
const router = express.Router();
const candidateProfileController = require('../controllers/candidate.profile.controller');
const authenticateCandidate = require('../middlewares/authenticateCandidate');

router.use(authenticateCandidate);

router.get('/', candidateProfileController.getProfile);
router.put('/', candidateProfileController.updateBasicProfile);

router.put('/experiences', candidateProfileController.updateExperiences);
router.put('/educations', candidateProfileController.updateEducations);
router.put('/certifications', candidateProfileController.updateCertifications);
router.put('/links', candidateProfileController.updateLinks);
router.put('/skills', candidateProfileController.updateSkills);

router.post('/documents', candidateProfileController.addDocument);
router.delete('/documents/:documentId', candidateProfileController.removeDocument);

module.exports = router;
