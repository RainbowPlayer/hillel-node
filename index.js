const { Worker } = require('worker_threads');

const numbers = [20000, 25000, 30000, 35000];

function runFactorial(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./factorialWorker.js', {
      workerData: n
    });
    worker.once('message', result => resolve({ n, result }));
    worker.once('error', reject);
    worker.once('exit', code => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

async function main() {
  console.log(`Master ${process.pid} starts ${numbers.length} workers…`);
  const tasks = numbers.map(n => runFactorial(n));
  const results = await Promise.all(tasks);
  for (const { n, result } of results) {
    console.log(`→ ${n}! has ${result.length} digits`);
  }
}

main().catch(err => console.error(err));
