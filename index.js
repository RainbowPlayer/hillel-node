const fs = require('fs');
const { Transform } = require('stream');

class MaskEveryLineTransform extends Transform {
  constructor(options) {
    super(options);
    this._buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this._buffer += chunk.toString();
    const lines = this._buffer.split(/\r?\n/);
    this._buffer = lines.pop();

    for (const line of lines) {
      if (line.trim()) {
        this.push('*'.repeat(line.length) + '\n');
      } else {
        this.push('\n');
      }
    }
    callback();
  }

  _flush(callback) {
    const line = this._buffer;
    if (line && line.trim()) {
      this.push('*'.repeat(line.length));
    }
    callback();
  }
}

fs.createReadStream('log.txt', { encoding: 'utf8' })
  .pipe(new MaskEveryLineTransform())
  .pipe(fs.createWriteStream('masked.txt'))
  .on('finish', () => console.log('success'))
