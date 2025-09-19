const http = require('node:http');
const path = require('node:path');
const config = require('./config');
const Database = require('./storage/database');
const Router = require('./http/router');
const createStaticHandler = require('./http/static');
const createServices = require('./services');
const registerRoutes = require('./routes');

function createServer() {
  const db = new Database();
  const baseContext = { config, db };
  const services = createServices(baseContext);
  const routerContext = { ...baseContext, services };
  const router = new Router(routerContext);
  registerRoutes(router, routerContext);
  const serveStatic = createStaticHandler(path.join(__dirname, '..', 'frontend'));
  return http.createServer((req, res) => {
    if (serveStatic(req, res)) {
      return;
    }
    router.handle(req, res);
  });
}

module.exports = {
  createServer,
};
