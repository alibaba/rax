# babel-preset-rax [![npm](https://img.shields.io/npm/v/babel-preset-rax.svg)](https://www.npmjs.com/package/babel-preset-rax) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/babel-preset-rax)](https://david-dm.org/alibaba/rax.svg?path=packages/babel-preset-rax) [![Known Vulnerabilities](https://snyk.io/test/npm/babel-preset-rax/badge.svg)](https://snyk.io/test/npm/babel-preset-rax)

> Babel preset for all Rax plugins.

This preset always includes the following plugins:

- [@babel/plugin-syntax-jsx](plugin-syntax-jsx.md)
- [@babel/plugin-transform-react-jsx](plugin-transform-react-jsx.md)
- [@babel/plugin-transform-react-display-name](plugin-transform-react-display-name.md)

And with the `development` option:

- [@babel/plugin-transform-react-jsx-self](plugin-transform-react-jsx-self.md)
- [@babel/plugin-transform-react-jsx-source](plugin-transform-react-jsx-source.md)


## Installation

Using npm:

```sh
npm install --save-dev babel-preset-rax
```

or using yarn:

```sh
yarn add babel-preset-rax --dev
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

Without options:

```json
{
  "presets": ["babel-preset-rax"]
}
```

With options:

```json
{
  "presets": [
    [
      "babel-preset-rax",
      {
        "pragma": "dom", // default pragma is createElement
        "pragmaFrag": "DomFrag", // default is Fragment
        "throwIfNamespace": false // defaults to true
      }
    ]
  ]
}
```

### Via CLI

```sh
babel --presets babel-preset-rax script.js
```

### Via Node API

```javascript
require("@babel/core").transform("code", {
  presets: ["babel-preset-rax"],
});
```

## Options

### `pragma`

`string`, defaults to `createElement`.

Replace the function used when compiling JSX expressions.

### `pragmaFrag`

`string`, defaults to `Fragment`.

Replace the component used when compiling JSX fragments.

### `useBuiltIns`

`boolean`, defaults to `false`.

Will use the native built-in instead of trying to polyfill behavior for any plugins that require one.

### `development`

`boolean`, defaults to `false`.

Toggles plugins that aid in development, such as [`@babel/plugin-transform-react-jsx-self`](plugin-transform-react-jsx-self.md) and [`@babel/plugin-transform-react-jsx-source`](plugin-transform-react-jsx-source.md).

This is useful when combined with the [env option](options.md#env) configuration or [js config files](config-files.md#javascript).

### `throwIfNamespace`

`boolean`, defaults to `true`.

Toggles whether or not to throw an error if a XML namespaced tag name is used. For example:

    <f:image />

Though the JSX spec allows this, it is disabled by default since React's JSX does not currently have support for it.

#### .babelrc.js

```js
module.exports = {
  presets: [
    [
      "babel-preset-rax",
      {
        development: process.env.BABEL_ENV === "development",
      },
    ],
  ],
};
```

#### .babelrc

> Note: the `env` option will likely get deprecated soon

```json
{
  "presets": ["babel-preset-rax"],
  "env": {
    "development": {
      "presets": [["babel-preset-rax", { "development": true }]]
    }
  }
}
