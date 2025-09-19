const fs = require('node:fs');
const path = require('node:path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function createStaticHandler(rootDir) {
  if (!rootDir) {
    return () => false;
  }
  const absoluteRoot = path.resolve(rootDir);
  if (!fs.existsSync(absoluteRoot)) {
    return () => false;
  }

  return (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      return false;
    }
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }
    const normalizedPath = path.normalize(pathname).replace(/^\.\.(?:[\\/]|$)/, '');
    const resolvedPath = path.join(absoluteRoot, normalizedPath);
    if (!resolvedPath.startsWith(absoluteRoot)) {
      return false;
    }
    let target = resolvedPath;
    try {
      const stats = fs.statSync(target);
      if (stats.isDirectory()) {
        target = path.join(target, 'index.html');
      }
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
        return false;
      }
    } catch (error) {
      return false;
    }

    const ext = path.extname(target).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'HEAD') {
      res.end();
      return true;
    }

    const stream = fs.createReadStream(target);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.statusCode = 500;
      }
      res.end();
    });
    stream.pipe(res);
    return true;
  };
}

module.exports = createStaticHandler;
