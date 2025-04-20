const { exec } = require('child_process');

const command = process.argv.slice(2).join(' ') || 'ls -la';

console.log(`Executing: ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log('Output:');
  console.log(stdout);
});
