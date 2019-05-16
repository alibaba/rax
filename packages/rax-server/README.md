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
    server.render('index', req, res);
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
* template <String>  mustache template content
* pages <Object>
  * key: page name 
  * value: <Object>
    * bundle <Class> bundle for page
    * template <String>  template for page （Optional）

```js

const { readFileSync } = require('fs');
const express = require('express');
const RaxServer = require('rax-server');

const PORT = 8080;
const app = express();

const server = new RaxServer({
  template: readFileSync('./dist/index.html'),
  pages: {
    index: {
      template: readFileSync('./dist/index.html'),
      bundle: require('./dist/server/index.js')
    },
    foo: {
      bundle: require('./dist/server/foo.js')
    },
    bar: {
      bundle: require('./dsit2/server/bar.js')
    }
  }
});

app.get('/', (req, res) => {
  server.render('index', req, res);
});

app.get('/foo/bar/baz', (req, res) => {
  server.render('bar', req, res);
});

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
```

#### server.render(page, req, res[, options])

options: <Object>

 * pathname <String>
 * query <Object>

```js
server.render(page, req, res);
```

#### server.renderToHTML(page, req, res[, options])

```js
const html = await server.renderToHTML(page, req, res);
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
  server.render('index', req, res);
});

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
```