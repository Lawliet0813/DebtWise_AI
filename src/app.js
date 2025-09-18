const http = require('node:http');
const config = require('./config');
const Database = require('./storage/database');
const Router = require('./http/router');
const createServices = require('./services');
const registerRoutes = require('./routes');

function createServer() {
  const db = new Database();
  const baseContext = { config, db };
  const services = createServices(baseContext);
  const routerContext = { ...baseContext, services };
  const router = new Router(routerContext);
  registerRoutes(router, routerContext);
  return http.createServer((req, res) => router.handle(req, res));
}

module.exports = {
  createServer,
};
