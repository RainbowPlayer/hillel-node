const fs = require('fs/promises');
const path = require('path');

async function replaceWord() {
  try {
    const src = path.join(__dirname, 'source.txt');
    const dest = path.join(__dirname, 'replaced.txt');

    const text = await fs.readFile(src, 'utf-8');
    const updated = text.replace(/Node/g, 'NODE.JS');

    await fs.writeFile(dest, updated);

    console.log('success');
  } catch (err) {
    console.error('error', err);
    process.exit(1);
  }
}

replaceWord();
