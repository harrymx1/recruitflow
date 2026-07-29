const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companies.controller');

// Public route to view company profile by slug
router.get('/:slug', companiesController.getPublicProfile);

module.exports = router;
