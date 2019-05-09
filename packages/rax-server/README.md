### 提供能力

* 错误处理
* 数据预取
* 模板拼装
* 缓存
* 流式渲染

### 安装

```bash
npm install rax-server --save
```

### 基础用法

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
* template <string> 页面模板  必选
* pages <Object> 必选
  * key 为 page name ，值为 _error 时 表示指定为错误页
  * vaue 为 page 的对应的描述信息 <Object>
    * bundle <Class> page 对应的 bundle
    * template 页面模板，可选，可覆盖默认 template
    * cache 是否开启缓存

示例

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

options: <Object> 可选

 * pathname <String> 可选，默认从 req.pathname 中获取有此值时，以这个值为准，
 * query <Object> 可选

```js
server.render(page, req, res);
```

#### server.renderToHTML(page, req, res[, options])

返回值: html

```js
const html = await server.renderToHTML(page, req, res);
```

### 结合其他框架使用

express 示例

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

### Serverless

