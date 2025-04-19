const crypto = require('crypto');
const readline = require('readline');

function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter password: ', (password) => {
  const hashed = hashPassword(password);
  console.log(`SHA-256 hash: ${hashed}`);
  rl.close();
});
