const jiraService = require('../services/atlassian');

const createIssue = async (req, res) => {
  try {
    const { summary, description, issueType } = req.body;
    const issue = await jiraService.createIssue(summary, description, issueType);
    res.status(201).json({ message: 'Jira issue created successfully', issue });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Jira issue', error: error.message });
  }
};

const getIssue = async (req, res) => {
  try {
    const { issueKey } = req.params;
    const issue = await jiraService.getIssue(issueKey);
    res.json({ issue });
  } catch (error) {
    res.status(500).json({ message: 'Error getting Jira issue', error: error.message });
  }
};

module.exports = {
  createIssue,
  getIssue
}; 