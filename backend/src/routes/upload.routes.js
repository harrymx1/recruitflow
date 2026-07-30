const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Only authenticated company members can request signed URLs for upload
router.post('/signed-url', authenticateCompany, uploadController.generateSignedUrl);

// Public or candidate route to upload document
router.post('/document', upload.single('file'), uploadController.uploadDocument);

module.exports = router;
