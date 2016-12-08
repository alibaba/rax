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
      {
        test: /\.rax$/,
        loader: ['babel', 'template']
      }
    ]
  }
};
```

Input `template.rax`
```html
<import name="React" from="react" />

<div>
  <span if={{props.show}}>{{props.text}}</span>
  <div for="{{item in props.item}}">
    <span key="{{item.toString()}}">{{item}}</span>
  </div>
</div>
```

Use in `index.js`
```
import React from 'react';
import ReactDOM from 'react-dom';

const Hello = require('./template.rax');

ReactDOM.render(
  <Hello text="hello world" show={true} item={[1, 2, 3]}/>,
  document.getElementById('body')
);
```

### Option engine

Or you can write jade syntax.
All templates you can see [this](https://github.com/tj/consolidate.js)

```
import(name="React" from="react")
div
  span(if="{{props.show}}") {{props.text}}
  div(for="{{item in props.item}}")
    span {{item}}
```

Config `webpack.config.js`
```js
// webpack.config.js

module.export = {
  module: {
      {
        test: /\.rax$/,
        loader: ['babel', 'template?engine=jade']
      }
    ]
  }
};
```

# TODO

- [] compile style、script
- [] support else、elif directive
