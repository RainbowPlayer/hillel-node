
const fs = require('fs');const path = require('path');

const filePath = path.join(__dirname, 'file.bin');

fs.readFile(filePath, (err, buffer) => {
  if (err) {
    console.error('Error reading file:', err);
    process.exit(1);
  }

  console.log('Raw Buffer object:', buffer);

  console.log('Hex dump:\n', buffer.toString('hex'));

  console.log('Binary-as-text \n', buffer.toString('binary'));
});
