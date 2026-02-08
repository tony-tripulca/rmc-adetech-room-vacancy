const http = require('http');
const path = require('path');
const { notFound } = require('./response');
const applyCors = require('./cors');

const ROOT_DIR = path.join(__dirname, '..');

const router = http.createServer((req, res) => {
  try {
    if (applyCors(req, res)) return;

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    req.query = Object.fromEntries(parsedUrl.searchParams.entries());

    // strip leading slash
    const pathname = parsedUrl.pathname.replace(/^\/+/, '');

    // resolve from project root
    const handlerPath = path.join(ROOT_DIR, pathname);

    const handler = require(handlerPath);

    return handler(req, res);
  } catch (err) {
    return notFound(res);
  }
});

module.exports = router;
