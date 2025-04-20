const http = require('http');
const PORT = 3003;
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.end(`Response from server3 (pid ${process.pid})`);
}).listen(PORT, () => console.log(`Server3 on http://localhost:${PORT}`));
