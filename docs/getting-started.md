# Getting Started

Welcome to Universal Rx! This page will help you to install Rx on your system, so that you can build apps with it right away. If you already have Rx installed, you can skip ahead to the Tutorial.

## Installation

### NPM
We recommend using Rx from npm with `webpack`. If you use npm for client package management, you can install Rx with:
```shell
npm install --save universal-rx
```

### CDN

If you don't want to use `npm` to manage client packages, the `rx` npm packages also provide UMD distributions in `dist` folders, which are hosted on CDN:

```html
<script src="https://unpkg.com/universal-rx@1/dist/rx.js"></script>
```

To load a specific version of `rx`, replace `1` with the version number.
Minified production versions of `rx` are available at:
```html
<script src="https://unpkg.com/universal-rx@1/dist/rx.min.js"></script>
```

## Learning Rx with example

First, clone the address of Rx.

```shell
git clone https://github.com/alibaba/rx.git
```

After installalation of Rx. You can run the local example.

```shell
npm start
open http://127.0.0.1:9999/examples/
```

## Test your local demo with Rx

```js
import {createElement, Component, render} from 'universal-rx';

class Hello extends Component {
  render() {
    return (
      <div style={{
      	with: 300,
      	height: 300,
      	backgroundColor: 'red',
      }} />
    );
  }
}

render(<Hello />);
```

If you're curious to learn more about Rx, continue on to the [Tutorial](./Tutorial.md).
