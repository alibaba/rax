# Getting Started

Welcome to Rax! This page will help you to install Rax on your system, so that you can build apps with it right away. If you already have Rax installed, you can skip ahead to the Tutorial.

## Installation

### NPM
We recommend using Rax from npm with `webpack`. If you use npm for client package management, you can install Rax with:
```shell
npm install --save rax
```

### CDN

If you don't want to use `npm` to manage client packages, the `rax` npm packages also provide UMD distributions in `dist` folders, which are hosted on CDN:

```html
<script src="https://unpkg.com/rax@1/dist/rax.js"></script>
```

To load a specific version of `rax`, replace `1` with the version number.
Minified production versions of `rax` are available at:
```html
<script src="https://unpkg.com/rax@1/dist/rax.min.js"></script>
```

## Learning Rax with example

First, clone the address of Rax.

```shell
git clone https://github.com/alibaba/rax.git
```

After installalation of Rax. You can run the local example.

```shell
npm start
open http://127.0.0.1:9999/examples/
```

## Test your local demo with Rax

```js
import {createElement, Component, render} from 'rax';

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

If you're curious to learn more about Rax, continue on to the [Tutorial](./Tutorial.md).
