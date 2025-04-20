const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const backends = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];
let idx = 0;

const app = express();

app.use((req, res, next) => {
  const target = backends[idx];
  idx = (idx + 1) % backends.length;
  createProxyMiddleware({ target, changeOrigin: true })(req, res, next);
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Express RoundRobin proxy on http://localhost:${PORT}`);
});
