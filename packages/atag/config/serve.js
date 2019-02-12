import { readFile, readFileSync } from 'fs';
import { createServer } from 'http';
import { resolve } from 'path';
import chalk from 'chalk';
import mime from 'mime';
import opener from 'opener';

const TEMPLATE_PATH = resolve('tests/template.html');
let server;

/**
 * Serve your rolled up bundle like webpack-dev-server
 * @param {ServeOptions|string|string[]} options
 */
function serve(options = { contentBase: '' }) {
  if (Array.isArray(options) || typeof options === 'string') {
    options = { contentBase: options };
  }
  options.contentBase = Array.isArray(options.contentBase) ? options.contentBase : [options.contentBase];
  options.host = options.host || 'localhost';
  options.port = process.env.PORT || options.port || 10001;
  options.headers = options.headers || {};
  options.openPage = options.openPage || '';
  mime.default_type = 'text/plain';

  const requestListener = (request, response) => {
    // Remove querystring
    const urlPath = decodeURI(request.url.split('?')[0]);

    Object.keys(options.headers).forEach((key) => {
      response.setHeader(key, options.headers[key]);
    });

    readFileFromContentBase(options.contentBase, urlPath, function(error, content, filePath) {
      if (!error) {
        return found(response, filePath, content);
      }
      if (error.code !== 'ENOENT') {
        response.writeHead(500);
        response.end('500 Internal Server Error' +
          '\n\n' + filePath +
          '\n\n' + Object.values(error).join('\n') +
          '\n\n(rollup-plugin-serve)', 'utf-8');
        return;
      }
      if (options.historyApiFallback) {
        var fallbackPath = typeof options.historyApiFallback === 'string' ? options.historyApiFallback : '/index.html';
        readFileFromContentBase(options.contentBase, fallbackPath, function(error, content, filePath) {
          if (error) {
            notFound(response, filePath);
          } else {
            found(response, filePath, content);
          }
        });
      } else {
        notFound(response, filePath);
      }
    });
  };

  // release previous server instance if rollup is reloading configuration in watch mode
  if (server) {
    server.close();
  }

  server = createServer(requestListener).listen(options.port, options.host);
  server.port = options.port;

  closeServerOnTermination(server);

  var running = options.verbose === false;

  return {
    name: 'serve',
    generateBundle() {
      if (!running) {
        running = true;

        // Log which url to visit
        const url = 'http://' + options.host + ':' + options.port;
        options.contentBase.forEach(base => {
          console.log(green(url) + ' -> ' + resolve(base));
        });

        // Open browser
        if (options.open) {
          opener(url + options.openPage);
        }

        console.log(chalk.green('Compiled successfully.'));
      }
    }
  };
}

function readFileFromContentBase(contentBase, urlPath, callback) {
  let filePath = resolve(contentBase[0] || '.', '.' + urlPath);

  // Load index.html in directories
  if (urlPath.endsWith('/')) {
    filePath = resolve(filePath, 'index.html');
  }

  const renderTemplate = /\.html/.test(filePath);
  readFile(renderTemplate ? TEMPLATE_PATH : filePath, (error, content) => {
    if (renderTemplate) {
      // Render template
      try {
        content = content
          .toString()
          // HTML test fixture code.
          .replace(/@TEST_FIXTURE/g, readFileSync(filePath))
          // Dev server port.
          .replace(/@SERVER_PORT/g, server.port);
      } catch (err) {
        error = err;
      }
    }
    if (error && contentBase.length > 1) {
      // Try to read from next contentBase
      readFileFromContentBase(contentBase.slice(1), urlPath, callback);
    } else {
      // We know enough
      callback(error, content, filePath);
    }
  });
}

function notFound(response, filePath) {
  response.writeHead(404);
  response.end('404 Not Found' +
    '\n\n' + filePath +
    '\n\n(rollup-plugin-serve)', 'utf-8');
}

function found(response, filePath, content) {
  response.writeHead(200, { 'Content-Type': mime.getType(filePath) });
  response.end(content, 'utf-8');
}

function green(text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m';
}

function closeServerOnTermination(server) {
  const terminationSignals = ['SIGINT', 'SIGTERM'];
  terminationSignals.forEach((signal) => {
    process.on(signal, () => {
      server.close();
      process.exit();
    });
  });
}

export default serve;
