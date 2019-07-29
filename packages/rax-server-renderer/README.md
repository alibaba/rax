# rax-server-renderer [![npm](https://img.shields.io/npm/v/rax-server-renderer.svg)](https://www.npmjs.com/package/rax-server-renderer) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/rax-server-renderer)](https://david-dm.org/alibaba/rax.svg?path=packages/rax-server-renderer) [![Known Vulnerabilities](https://snyk.io/test/npm/rax-server-renderer/badge.svg)](https://snyk.io/test/npm/rax-server-renderer)

> Rax renderer for server-side render.

## Install

```sh
$ npm install --save rax-server-renderer
```

## Usage

```jsx
import {createElement, Component} from 'rax';
import renderer from 'rax-server-renderer';

class MyComponent extends Component {
  render() {
    return <div>Hello World</div>;
  }
}

renderer.renderToString(<MyComponent />);
```