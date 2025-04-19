const crypto = require('crypto');
const readline = require('readline');

const iterations = 100_000;
const keyLen = 64;
const digest = 'sha512';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto
    .pbkdf2Sync(password, salt, iterations, keyLen, digest)
    .toString('hex');
  return `${salt}:${derived}`;
}

const stored = hashPassword('qwerty1234');
console.log('Stored (for demo):', stored);

function verifyPassword(attempt, stored) {
  const [salt, key] = stored.split(':');
  const derived = crypto.pbkdf2Sync(attempt, salt, iterations, keyLen, digest);
  const original = Buffer.from(key, 'hex');
  return crypto.timingSafeEqual(original, derived);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter your password: ', (password) => {
  const ok = verifyPassword(password, stored);
  console.log(ok ? 'success' : 'error');
  rl.close();
});
