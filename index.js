const fs = require('fs');

fs.copyFile('source.txt', 'copy.txt', (err) => {
  if (err) {
    console.error('Error copying file:', err);
    process.exit(1);
  }
  console.log('File successfully');
});
