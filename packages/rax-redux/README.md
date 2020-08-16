# rax-redux [![npm](https://img.shields.io/npm/v/rax-redux.svg)](https://www.npmjs.com/package/rax-redux)


### Install

```sh
npm install --save rax-redux
```

### Usage

```js
import { createElement, render } from 'rax';
import { Provider } from 'rax-redux';

import store from './store';
import App from './App';

render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### API

Some with react-redux v7.1 https://react-redux.js.org
