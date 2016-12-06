# rax [![npm](https://img.shields.io/npm/v/rax.svg)](https://www.npmjs.com/package/rax) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/rax)](https://david-dm.org/alibaba/rax.svg?path=packages/rax) [![Known Vulnerabilities](https://snyk.io/test/npm/rax/badge.svg)](https://snyk.io/test/npm/rax)

> A universal React-compatible render engine

## Install

```sh
$ npm install --save rax
```

## Usage

```jsx
import {createElement, Component, render} from 'rax';

class MyComponent extends Component {
  render() {
    return <div>Hello World</div>;
  }
}

render(<MyComponent />);
```
