const express = require('express');
const router = express.Router();
const authCompanyController = require('../controllers/auth.company.controller');
const validateBody = require('../middlewares/validateBody');
const { registerSchema, loginSchema, refreshSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validators/auth.company.validator');
const authenticateCompany = require('../middlewares/authenticateCompany');

// For cookies parsing in refresh, we need cookie-parser. We should add it to app.js later.
router.post('/register', validateBody(registerSchema), authCompanyController.register);
router.post('/login', validateBody(loginSchema), authCompanyController.login);
router.post('/refresh', authCompanyController.refresh);
router.post('/logout', authenticateCompany, authCompanyController.logout);

router.post('/forgot-password', validateBody(forgotPasswordSchema), authCompanyController.forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), authCompanyController.resetPassword);

module.exports = router;
