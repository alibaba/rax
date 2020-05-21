# rax [![npm](https://img.shields.io/npm/v/rax.svg)](https://www.npmjs.com/package/rax) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/rax)](https://david-dm.org/alibaba/rax.svg?path=packages/rax) [![Known Vulnerabilities](https://snyk.io/test/npm/rax/badge.svg)](https://snyk.io/test/npm/rax)

> A universal React-compatible render engine

## Install

```sh
$ npm install --save rax
```

### With TypeScript

```sh
$ npm install --save-dev @types/rax
```

## Usage

```jsx
import {createElement, render} from 'rax';
import * as DriverDOM from 'driver-dom';

function MyComponent() {
  return <div>Hello World</div>;
}

render(<MyComponent />, document.body, { driver: DriverDOM });
```