const http = require('http');
const { URL } = require('url');

const backends = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];
let idx = 0;

http.createServer((req, res) => {
  const target = new URL(backends[idx]);
  idx = (idx + 1) % backends.length;

  const options = {
    hostname: target.hostname,
    port:     target.port,
    path:     req.url,
    method:   req.method,
    headers:  req.headers,
  };

  const proxyReq = http.request(options, proxyRes => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', () => {
    res.writeHead(502);
    res.end('Bad gateway');
  });

  req.pipe(proxyReq, { end: true });
}).listen(8000, () => {
  console.log('HTTP RoundRobin proxy listening on http://localhost:8000');
});
