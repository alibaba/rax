# babel-preset-react

> Babel preset for all Rx plugins.

## Install

```sh
$ npm install --save-dev babel-preset-rx
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "presets": ["rx"]
}
```

### Via CLI

```sh
$ babel script.js --presets rx
```

### Via Node API

```javascript
require('babel-core').transform('code', {
  presets: ['rx']
});
```
