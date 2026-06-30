// Tiny zero-dependency static server for the Forge.
// Usage:  node serve.js   →   open http://localhost:5566
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5566;
const root = __dirname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p === '') p = '/index.html';
  const fp = path.join(root, path.normalize(p));
  if (!fp.startsWith(root)) { res.writeHead(403); res.end('forbidden'); return; }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, {
      'Content-Type': types[path.extname(fp)] || 'application/octet-stream',
      'Cache-Control': 'no-store, must-revalidate'
    });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Dice/Spinner Forge → http://localhost:${PORT}`));
