const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/requests.log');
fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

module.exports = function logger(req) {
  const now   = new Date().toISOString();
  const entry = `[${now}] ${req.method} ${req.url}\n`;

  fs.appendFile(logFilePath, entry, err => {
    if (err) console.error('Log write error:', err);
  });

  console.log(entry.trim());
};
