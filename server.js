const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = 3474;
const DATA_FILE = path.join(__dirname, 'burnlist.json');
const HTML_FILE = path.join(__dirname, 'BURNLIST.html');

const clients = new Set();

fs.watch(HTML_FILE, () => {
  for (const res of clients) {
    res.write('data: reload\n\n');
  }
});

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/sse') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write(':\n\n'); // initial ping
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(HTML_FILE, (err, data) => {
      if (err) { res.writeHead(500); res.end('Cannot read HTML'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/data') {
    if (!fs.existsSync(DATA_FILE)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('null');
      return;
    }
    fs.readFile(DATA_FILE, (err, data) => {
      if (err) { res.writeHead(500); res.end('{}'); return; }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/data') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      fs.writeFile(DATA_FILE, body, err => {
        if (err) { res.writeHead(500); res.end('Save failed'); return; }
        res.writeHead(200);
        res.end('ok');
      });
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`BURNLIST running → http://localhost:${PORT}`);
});
