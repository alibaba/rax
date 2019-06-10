# rax-server

### Install

```bash
npm install rax-server --save
```

### Usage

```js
const http = require('http');
const RaxServer = require('rax-server');
const PORT = 8080;
const server = new RaxServer({
  // ...
});

const app = new http.createServer((req, res) => {
  if (req.pathname === '/index') {
    server.render(req, res, {
      page: 'index'
    });
  } else {
    // ...
  }
});

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
```

### API

#### new RaxServer(options)

options:
* document
  * component
* shell（optional）
  * component
* pages
  * [pageName]
    * title
    * component: component for page
    * template: template for page（optional）
    * style: styles for page
    * scripts: scripts for page
* renderOpts: config for rax-server-renderer

```js
const { readFileSync } = require('fs');
const express = require('express');
const RaxServer = require('rax-server');

const PORT = 8080;
const app = express();

const options = {
  document: {
    component: require('./dist/server/document.js'),
  },
  shell: {
    component: require('./dist/server/shell.js'),
  },
  pages: {
    index: {
      title: 'Index',
      component: require('./dist/server/index.js'),
      styles: ['./client/index.css'],
      scripts: ['./client/index.js']
    },
    bar: {
      component: require('./dsit2/server/bar.js')
    }
  }
};

const server = new RaxServer(options);

app.get('/', (req, res) => {
  server.render(req, res, {
    page: 'index'
  });
});

app.get('/foo/bar/baz', (req, res) => {
  server.render(req, res, {
    page: 'bar'
  });
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
```

#### server.render(req, res[, options])

options:
 * page
 * pathname 
 * query
 * component
 * styles
 * scripts
 * title

```js
server.render(req, res, {
  page: 'index'
});
```

#### server.renderToHTML(req, res[, options])

```js
const html = await server.renderToHTML(req, res, {
  page: 'index'
});
```

### Use with frameworks

eg. express

```js
const express = require('express');
const RaxServer = require('rax-server');

const PORT = 8080;
const app = express();

const server = new RaxServer({
  // ...
});

app.get('/index', (req, res) => {
  server.render(req, res, {
    page: 'index'
  });
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
```