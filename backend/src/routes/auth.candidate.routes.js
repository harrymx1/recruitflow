const express = require('express');
const router = express.Router();
const authCandidateController = require('../controllers/auth.candidate.controller');
const validateBody = require('../middlewares/validateBody');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/auth.candidate.validator');
const authenticateCandidate = require('../middlewares/authenticateCandidate');

router.post('/register', validateBody(registerSchema), authCandidateController.register);
router.post('/login', validateBody(loginSchema), authCandidateController.login);
router.post('/refresh', authCandidateController.refresh);
router.post('/logout', authenticateCandidate, authCandidateController.logout);

router.post('/forgot-password', validateBody(forgotPasswordSchema), authCandidateController.forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), authCandidateController.resetPassword);

module.exports = router;
