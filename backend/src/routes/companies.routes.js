const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companies.controller');
const validateBody = require('../middlewares/validateBody');
const { inviteTeamMemberSchema, toggleStatusSchema } = require('../validators/companies.validator');
const authenticateCompany = require('../middlewares/authenticateCompany');
const requireRole = require('../middlewares/requireRole');
const scopeToCompany = require('../middlewares/scopeToCompany');

router.use(authenticateCompany, scopeToCompany);

router.get('/profile', companiesController.getProfile);
router.put('/profile', requireRole('admin'), companiesController.updateProfile);

router.get('/locations', companiesController.getLocations);
router.post('/locations', requireRole('admin'), companiesController.addLocation);
router.delete('/locations/:locationId', requireRole('admin'), companiesController.removeLocation);
router.patch('/locations/:locationId/headquarters', requireRole('admin'), companiesController.setHeadquarters);

router.get('/team', companiesController.getTeamMembers);
router.post('/team/invite', requireRole('admin'), validateBody(inviteTeamMemberSchema), companiesController.inviteTeamMember);
router.patch('/team/:memberId', requireRole('admin'), validateBody(toggleStatusSchema), companiesController.toggleMemberStatus);

module.exports = router;
