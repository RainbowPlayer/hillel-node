const http = require('http');
const PORT = 3001;
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.end(`Response from server1 (pid ${process.pid})`);
}).listen(PORT, () => console.log(`Server1 on http://localhost:${PORT}`));
