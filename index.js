const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(
  path.join(__dirname, 'log.txt'),
  { encoding: 'utf8', highWaterMark: 100 }
);

let i = 0;
stream.on('data', (chunk) => {
  console.log(`--- Chunk #${++i} (length: ${chunk.length} chars) ---`);
  console.log(chunk);
});
stream.on('end', () => console.log('--- End of file ---'));
stream.on('error', (err) => console.error(err));
