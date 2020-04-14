# miniapp-render

> Forked from kbone.

## Introduction

`miniapp-render` is a DOM simulator designed for MiniApp which can provides DOM-related API for developers.

> You can think of it as a lightweight jsDom running on appService.

## Install

```shell
npm install --save miniapp-render
```

## Usage

```js
const render = require('miniapp-render')

```js
Page({
  onLoad() {
    // Create page
    const { pageId, window, document } = render.createPage(this.route, config)
    this.pageId = pageId
  },
  onUnload() {
    // Destroy the page
    render.destroyPage(this.pageId)
  },
})
```

## API

### createPage(route, config)

Create the page.

| Param | Type | Description |
|---|---|---|
| route | String | The route of the page, aka the route property of the instance of MiniApp page |
| config | Object | Global config of the page. It's shared by all pages. Every time the page creates, passed-in config will override current one |

```js
const page1 = render.createPage('/pages/home/index', config1) // Pass in config1
const page2 = render.createPage('/pages/home/index', config2) // Pass in config2

// The latter config2 will override config1,  all pages will use config2 and config1 will be deprecated.
```

### destroyPage(pageId)

Destroy the page
