const fs = require('fs');
const path = require('path');

function findLargestFile(dir) {
  const entries = fs.readdirSync(dir);
  let largest = { name: null, size: 0 };

  for (const name of entries) {
    const fullPath = path.join(dir, name);
    const stats = fs.statSync(fullPath);

    if (stats.isFile() && stats.size > largest.size) {
      largest = { name, size: stats.size };
    }
  }

  if (largest.name) {
    console.log(`Largest file: ${largest.name} (${largest.size} bytes)`);
  } else {
    console.log('No files found in', dir);
  }
}

const filesDir = path.join(__dirname, 'files');
findLargestFile(filesDir);
