const express = require('express');
const router = express.Router();
const hrEmailTemplatesController = require('../controllers/hr.emailTemplates.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');

router.get('/:type', authenticateCompany, hrEmailTemplatesController.getTemplate);
router.put('/:type', authenticateCompany, hrEmailTemplatesController.saveTemplate);

module.exports = router;
