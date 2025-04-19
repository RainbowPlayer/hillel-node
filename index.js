const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

const message = 'Test message signature';

const signer = crypto.createSign('RSA-SHA256');
signer.update(message);
signer.end();
const signature = signer.sign(privateKey, 'base64');

console.log('Message:', message);
console.log('Signature (base64):', signature);

const verifier = crypto.createVerify('RSA-SHA256');
verifier.update(message);
verifier.end();
const isValid = verifier.verify(publicKey, signature, 'base64');

console.log('Verification result:', isValid ? 'success' : 'error');
