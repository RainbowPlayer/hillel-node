const { parentPort, workerData } = require('worker_threads');

function factorialBig(n) {
  let res = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    res *= i;
  }
  return res;
}

const n = workerData;
const fact = factorialBig(n);

parentPort.postMessage(fact.toString());
