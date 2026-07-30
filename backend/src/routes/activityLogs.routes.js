const express = require('express');
const router = express.Router();
const activityLogsController = require('../controllers/activityLogs.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');

router.get('/:id/activity-log', authenticateCompany, activityLogsController.getLogs);

module.exports = router;
