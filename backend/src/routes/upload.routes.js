const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');

// Only authenticated company members can request signed URLs for upload
router.post('/signed-url', authenticateCompany, uploadController.generateSignedUrl);

module.exports = router;
