# rax-ssr-dev-server

> Dev server for server side render.

## Install

```sh
$ npm install --save-dev rax-ssr-dev-server
```

## Usage

```js
const SSRDevServer = require('rax-ssr-dev-server');;

new SSRDevServer(compiler, options);
```

## Options

### appConfig

`object`

config info for app

```json
{
  "pages": {
    "index": "home page"
  }
}
```

### pagesManifest

`object`

bunlde info for pages

```json
{
  "index": "./build/server/index.js",
  "foo": "./build/server/foo.js"
}
```

### assetsManifest

`object`

assets info for pages

```json
{
  "index": {
    "scripts": [
      "./build/client/index.js"
    ],
    "styles": [
      ".build/client/index.css"
    ]
  },
  "foo": {
    "scripts": [
      "./build/client/foo.js"
    ],
    "styles": []
  }
}
```

### assetsManifestPath

`string`

absolute path for assets manifest file

If assets manifest is update with compilation, you can save it to a temp file and config this option. SSR will read the assets manifest before each render.