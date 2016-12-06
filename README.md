**Warning: This is currently a private repo, please do not share this code.**

<p align="center">
  <a href="https://alibaba.github.io/rax">
    <img alt="Rax" src="https://gw.alicdn.com/L1/461/1/40137b64ab73a123e78d8246cd81c8379358c999_400x400.jpg" width="200">
  </a>
</p>

<p align="center">
A universal React-compatible render engine.
</p>

<p align="center">
<img src="https://img.shields.io/npm/l/rax.svg">
<img src="https://img.shields.io/npm/v/rax.svg">
<img src="https://img.shields.io/npm/dm/rax.svg">
</p>

---

Rax is a universal JavaScript library with a largely React-compatible API. If you use React, you already know how to use Rax.

:zap: **Fast:** blazing fast virtual DOM.

:dart: **Tiny:** 8.5kb only after min+gzip.

:art: **Universal:** cross Browser、Weex and Node.js.

## Size Comparison

[Angular 1.5.8](https://unpkg.com/angular@1.5.8/angular.min.js) - 55.4kb (gzip)

<img width="100%" height="5" src="https://cloud.githubusercontent.com/assets/2505411/20559178/59a527a0-b1ae-11e6-9b71-581323ac22f8.png">

[React 15.3.2](https://unpkg.com/react@15.3.2/dist/react.min.js) - 43.7kb (gzip)

<img width="78.88%" height="5" src="https://cloud.githubusercontent.com/assets/2505411/20559178/59a527a0-b1ae-11e6-9b71-581323ac22f8.png">

[Vue 2.0.8](https://unpkg.com/vue@2.0.8/dist/vue.min.js) - 24.4kb (gzip)

<img width="44.04%" height="5" src="https://cloud.githubusercontent.com/assets/2505411/20559178/59a527a0-b1ae-11e6-9b71-581323ac22f8.png">

[Rax 0.0.8](https://unpkg.com/rax@0.0.5/dist/rax.min.js) - 8.0kb (gzip)

<img width="14.44%" height="5" src="https://cloud.githubusercontent.com/assets/2505411/20559178/59a527a0-b1ae-11e6-9b71-581323ac22f8.png">

## Server-side Rendering Comparison
> [Benchmark repository](https://github.com/taobaofed/server-side-rendering-comparison): Run on a MacBook Air Intel Core i5 @1.4 GHz x 2 with 8 GB memory.

| Library      | renderToSring (per second)  |
|--------------|----------------|
| React@15.3.2 | 297 op/s |
| Vue@2.0.8    | 1092 op/s|
| Rax@0.0.8     | 1553 op/s (fastest)|


## Installation

### NPM
We recommend using Rax from npm with `webpack`. If you use npm for client package management, you can install Rax with:
```sh
npm install --save rax
```

### CDN

If you don't want to use `npm` to manage client packages, the `rax` npm packages also provide UMD distributions in `dist` folders, which are hosted on a CDN:
```html
<script src="https://unpkg.com/rax@1/dist/rax.js"></script>
```

To load a specific version of `rax`, replace `1` with the version number.
Minified production versions of `rax` are available at:
```html
<script src="https://unpkg.com/rax@1/dist/rax.min.js"></script>
```

## Example

```js
import {createElement, Component, render} from 'rax';

class Hello extends Component {
  render() {
    return <text style={styles.title}>Hello {this.props.name}</text>;
  }
}

const styles = {
  title: {
    color: '#ff4400',
    fontSize: 48,
    fontWeight: 'bold',
  }
};

render(<Hello name="world" />);
```

More examples take a look at the [`examples`](/examples/) folder.

## Snapshot Testing


## Universal Libraries

* :tophat: [rax](/packages/rax): A universal React-compatible render engine.
* :earth_asia: [universal-env](/packages/universal-env): A universal environment utilities.
* :loop: [universal-transition](/packages/universal-transition): A universal transition API.
* :iphone: [universal-platform](/packages/universal-platform): A universal Platform API.
* :bikini: [universal-stylesheet](/packages/universal-stylesheet): A universal StyleSheet API.
* :point_up_2: [universal-panresponder](/packages/universal-panresponder): A universal PanResponder API.
* :speech_balloon: [universal-toast](/packages/universal-panresponder): A universal Toast API.
* :postbox: [universal-router](https://github.com/kriasoft/universal-router): A simple middleware-style router for isomorphic JavaScript web apps.

## Contributing

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [guidelines for contributing](./.github/CONTRIBUTING.md).
