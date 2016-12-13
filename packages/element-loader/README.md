# template-loader

> A webpack loader converts markup to react class

## Install

```sh
npm install --save-dev template-loader
```

## Usage

Config template loader in `webpack.config.js`:
```js
// webpack.config.js

module.export = {
  module: {
    loaders: [
      {
        test: /\.html/,
        loader: 'element-loader'
      }
    ]
  }
};
```

Input `Container.html`
```html
<link rel="import" href="./Hello.html" />

<template>
  <div>
    <span class="text" $if="{{show}}">{{text}}</span>
    <div class="item" $for="{{item in items}}">
      <span class="name">{{item}}</span>
    </div>
    <Hello message="world"></Hello>
  </div>
</template>

<style>
  .text {
    font-size: 25rem;
    color: gray;
  }
  .name {
    color: red;
    font-size: 40rem;
  }
</style>

<style>
  .item {
    width: 200rem;
    height: 60rem;
    background-color: blue;
  }
</style>
```

Input `Hello.html`
```html
<link rel="stylesheet" href="./hello.css" />

<template>
 <span class="textMessage">{{message}}</span>
</template>
```

Input `hello.css`
```css
.textMessage {
 color: red;
}
```

Use react in `index.js`
```js
import React from 'react';
import ReactDOM from 'react-dom';

const Container = require('./Container.html');

ReactDOM.render(
  <Container text="hello world" show={true} items={[1, 2, 3]}/>,
  document.getElementById('body')
);
```

### Rax

Of cource, You also can use rax with es6.

Use rax in `index.js`
```js
import { createElement, Component, render } from 'rax';
import Container from './Container.html';

class App extends Component {
  render() {
    return <Container text="hello world" show={true} items={[1, 2, 3]}/>;
  }
}

render(<App />);
```

Config `webpack.config.js`
```js
module.export = {
  module: {
    loaders: [
      {
        test: /\.html/,
        loader: 'element-loader?project=rax'
      }
    ]
  }
};
```

In `.babelrx`
```js
{ 
  "presets": ["es2015", "rax"]
}
```

## Directives

- $for: repeat a array eg. "{{item in items}}"
- $if:  show or hide eg. "{{x < 5}}" 

## TODO

- [] compile script
- [] support else、elif directive
