const http = require('http');
const PORT = 3002;
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.end(`Response from server2 (pid ${process.pid})`);
}).listen(PORT, () => console.log(`Server2 on http://localhost:${PORT}`));
