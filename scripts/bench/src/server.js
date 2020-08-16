const httpServer = require('http-server');

function createHTTPServer() {
  const server = httpServer.createServer({
    robots: true,
    cache: 'no-store',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
  server.listen(8080);
  return server;
}

module.exports = createHTTPServer;