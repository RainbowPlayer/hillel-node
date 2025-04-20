const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter a message: ', (message) => {
  console.log('Original message:', message);

  const buffer = Buffer.from(message, 'utf-8');

  const binaryArray = Array.from(buffer).map(
    byte => byte.toString(2).padStart(8, '0')
  );
  const binaryString = binaryArray.join(' ');
  console.log('Binary representation:', binaryString);

  const restoredBytes = binaryString.split(' ').map(bin => parseInt(bin, 2));
  const restoredBuffer = Buffer.from(restoredBytes);

  const restoredMessage = restoredBuffer.toString('utf-8');
  console.log('Restored message:', restoredMessage);

  rl.close();
});