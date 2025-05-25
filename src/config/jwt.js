const crypto = require('crypto');

// Generate a random JWT secret on server start
const JWT_SECRET = crypto.randomBytes(64).toString('hex');

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN: '1h'
}; 