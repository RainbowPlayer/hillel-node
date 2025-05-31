const JiraClient = require('jira-client');
const config = require('../config/config');

const jira = new JiraClient({
  protocol: config.jira.protocol,
  host: config.jira.host,
  username: config.jira.username,
  password: config.jira.password,
  apiVersion: config.jira.apiVersion,
  strictSSL: config.jira.strictSSL
});

class JiraService {
  async createIssue(summary, description, issueType = 'Task') {
    try {
      const issue = await jira.addNewIssue({
        fields: {
          project: {
            key: 'KAN'
          },
          summary: summary,
          description: description,
          issuetype: {
            name: issueType
          }
        }
      });
      return issue;
    } catch (error) {
      console.error('Error creating Jira issue:', error);
      throw error;
    }
  }

  async getIssue(issueKey) {
    try {
      const issue = await jira.findIssue(issueKey);
      return issue;
    } catch (error) {
      console.error('Error getting Jira issue:', error);
      throw error;
    }
  }
}

module.exports = new JiraService(); 