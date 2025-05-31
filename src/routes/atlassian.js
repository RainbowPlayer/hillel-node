const express = require('express');
const router = express.Router();
const jiraController = require('../controllers/atlassian');
const { authenticateToken } = require('../middleware/auth');

router.post('/issues', authenticateToken, jiraController.createIssue);
router.get('/issues/:issueKey', authenticateToken, jiraController.getIssue);

module.exports = router; 