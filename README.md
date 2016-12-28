**Warning: This is currently a private repo, please do not share this code.**

<p align="center">
  <a href="https://rax.taobaofed.org">
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

:dart: **Tiny:** 8.0kb only after min+gzip.

:art: **Universal:** cross Browser、Weex and Node.js.

## Size Comparison

[Angular 1.5.8](https://unpkg.com/angular@1.5.8/angular.min.js) - 55.4kb (gzip)

<img width="100%" height="5" src="https://cloud.githubusercontent.com/assets/2505411/20559178/59a527a0-b1ae-11e6-9b71-581323ac22f8.png">

[React 15.3.2](https://unpkg.com/react@15.3.2/dist/react.min.js) - 43.7kb (gzip)

<img width="78.88%" height="5" src="https://cloud.githubusercontent.com/assets/2505411/20559178/59a527a0-b1ae-11e6-9b71-581323ac22f8.png">

[Vue 2.0.8](https://unpkg.com/vue@2.0.8/dist/vue.min.js) - 24.4kb (gzip)

<img width="44.04%" height="5" src="https://cloud.githubusercontent.com/assets/2505411/20559178/59a527a0-b1ae-11e6-9b71-581323ac22f8.png">

[Rax 0.0.2](https://unpkg.com/rax@0.0.2/dist/rax.min.js) - 8.0kb (gzip)

<img width="14.44%" height="5" src="https://cloud.githubusercontent.com/assets/2505411/20559178/59a527a0-b1ae-11e6-9b71-581323ac22f8.png">

## Server-side Rendering Comparison
> [Benchmark repository](https://github.com/taobaofed/server-side-rendering-comparison): Run on a MacBook Air Intel Core i5 @1.4 GHz x 2 with 8 GB memory.

| Library      | renderToSring (per second)  |
|--------------|-----------------------------|
| React@15.3.2 | 297 op/s                    |
| Vue@2.0.8    | 1092 op/s                   |
| Rax@0.0.2    | 1553 op/s (fastest)         |


## Quick Start

Install the Rax CLI tools to init project:

```sh
npm install rax-cli -g
rax init YourProjectName
```

Start local server to launch project:
```sh
cd YourProjectName
npm run start
```

## Examples

```js
import {createElement, Component, render} from 'rax';
import {Text} from 'rax-components';

class Hello extends Component {
  render() {
    return <Text style={styles.title}>Hello {this.props.name}</Text>;
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

## Rax Renderers

* :traffic_light: [rax-test-renderer](/packages/rax-test-renderer): Rax renderer for snapshot testing.
* :computer: [rax-server-renderer](/packages/rax-server-renderer): Rax renderer for server-side render.

## Universal Libraries

* :earth_asia: [universal-env](/packages/universal-env): A universal environment utilities.
* :loop: [universal-transition](/packages/universal-transition): A universal transition API.
* :iphone: [universal-platform](/packages/universal-platform): A universal Platform API.
* :bikini: [universal-stylesheet](/packages/universal-stylesheet): A universal StyleSheet API.
* :point_up_2: [universal-panresponder](/packages/universal-panresponder): A universal PanResponder API.
* :speech_balloon: [universal-toast](/packages/universal-panresponder): A universal Toast API.
* :postbox: [universal-jsonp](/packages/universal-jsonp): A universal JSONP utilities.

## Contributing

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [guidelines for contributing](./.github/CONTRIBUTING.md).

<a href="https://alibaba.github.io/weex/">
<img alt="Weex Inside" src="https://cloud.githubusercontent.com/assets/677114/21266275/575eabee-c3e0-11e6-92d2-ad57e99372f2.png" width="200">
</a>
