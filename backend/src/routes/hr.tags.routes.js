const express = require('express');
const router = express.Router();
const hrTagsController = require('../controllers/hr.tags.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');

router.get('/', authenticateCompany, hrTagsController.getTags);
router.post('/', authenticateCompany, hrTagsController.createTag);
router.post('/applications/:id', authenticateCompany, hrTagsController.assignTag);
router.delete('/applications/:id/:tagId', authenticateCompany, hrTagsController.removeTag);

module.exports = router;
