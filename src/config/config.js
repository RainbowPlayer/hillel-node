require('dotenv').config();

module.exports = {
  jira: {
    protocol: 'https',
    host: process.env.JIRA_HOST || 'kolak375.atlassian.net',
    username: process.env.JIRA_EMAIL || 'kolak375@gmail.com',
    password: process.env.JIRA_API_TOKEN,
    apiVersion: '2',
    strictSSL: true
  }
}; 