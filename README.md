<p align="center">
  <a href="https://rax.taobaofed.org">
    <img alt="Rax" src="https://gw.alicdn.com/L1/461/1/40137b64ab73a123e78d8246cd81c8379358c999_400x400.jpg" width="200">
  </a>
</p>

<p align="center">
A universal React-compatible render engine.
</p>

<p align="center">
  <a href="https://github.com/alibaba/rax/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/rax.svg"></a>
  <a href="https://www.npmjs.com/package/rax"><img src="https://img.shields.io/npm/v/rax.svg"></a>
  <a href="https://www.npmjs.com/package/rax"><img src="https://img.shields.io/npm/dm/rax.svg"></a>
  <a href="https://travis-ci.org/alibaba/rax"><img src="https://travis-ci.org/alibaba/rax.svg"></a>
</p>

---

Rax is a universal JavaScript library with a largely React-compatible API. If you use React, you already know how to use Rax.

:zap: **Fast:** blazing fast virtual DOM.

:dart: **Tiny:** 8.0 KB minified + gzipped.

:art: **Universal:** works in browsers, Weex, Node.js and could works more container that implement [driver specification](./docs/driver-spec.md).

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

More examples take a look at the [`examples`](/examples/) folder:
* [Components](./examples/components)
* [Redux](/examples/redux)
* [Game2048](/examples/game2048)
* [Drag](/examples/drag)
* [TicTacToe](/examples/tictactoe)
* [Todo](/examples/todo)
* [UIKit](/examples/uikit)
* [Profile](/examples/profile)
* [Parallax](/examples/parallax)

## Rax Renderers

* :traffic_light: [rax-test-renderer](/packages/rax-test-renderer): Rax renderer for snapshot testing.
* :computer: [rax-server-renderer](/packages/rax-server-renderer): Rax renderer for server-side render.

## Universal Libraries

* :earth_asia: [universal-env](/packages/universal-env): A universal environment utilities.
* :loop: [universal-transition](/packages/universal-transition): A universal transition API.
* :iphone: [universal-platform](/packages/universal-platform): A universal Platform API.
* :bikini: [universal-stylesheet](/packages/universal-stylesheet): A universal StyleSheet API.
* :point_up_2: [universal-panresponder](/packages/universal-panresponder): A universal PanResponder API.
* :speech_balloon: [universal-toast](/packages/universal-toast): A universal Toast API.
* :postbox: [universal-jsonp](/packages/universal-jsonp): A universal JSONP utilities.


## Developer Tools

* [React Developer Tools](https://github.com/facebook/react-devtools): Allow you inspect and modify the state of your Rax components at runtime in Chrome Developer Tools.

<p align="center">
<img alt="React Developer Tools" src="https://cloud.githubusercontent.com/assets/677114/21539681/0a442c54-cde4-11e6-89cd-687dbc244d94.png" width="400">
</p>

* [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension): Provide power-ups for your Redux development workflow.
  1. Use the `rax-redux` module in your app
  2. Simply replace code follow the [Redux DevTools extension usage doc](https://github.com/zalmoxisus/redux-devtools-extension#usage)

<p align="center">
<img alt="Redux DevTools extension" src="https://cloud.githubusercontent.com/assets/677114/21539902/f66d25a8-cde5-11e6-8f68-f0fadbff66b7.png" width="400">
</p>

## Contributing

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [guidelines for contributing](./.github/CONTRIBUTING.md).

### Development Workflow

After cloning rax, run `npm install` to fetch its dependencies.  
Run `npm run setup` link and bootstrap project before development.
Then, you can run several commands:

* `npm run lint` checks the code style.
* `npm test` runs the complete test suite.
* `npm test -- --watch` runs an interactive test watcher.
* `npm test <pattern>` runs tests with matching filenames.
* `npm run build` creates `lib` and `dist` folder with all the packages.
* `npm start` start local server with `examples` folder.


## Core Team

<table>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <img width="128" height="128" src="https://github.com/yuanyan.png?s=128">
        <br>
        <a href="https://github.com/yuanyan">@yuanyan</a>
        <p>Core</p>
      </td>
      <td align="center" valign="top">
        <img width="128" height="128" src="https://github.com/imsobear.png?s=128">
        <br>
        <a href="https://github.com/imsobear">@imsobear</a>
        <p>Development</p>
      </td>
      <td align="center" valign="top">
        <img width="128" height="128" src="https://github.com/yacheng.png?s=128">
        <br>
        <a href="https://github.com/yacheng">@yacheng</a>
        <p>Components</p>
      </td>
      <td align="center" valign="top">
        <img width="128" height="128" src="https://github.com/boiawang.png?s=128">
        <br>
        <a href="https://github.com/boiawang">@boiawang</a>
        <p>Babel Loaders &amp; Plugins</p>
      </td>
      <td align="center" valign="top">
        <img width="128" height="128" src="https://github.com/noyobo.png?s=128">
        <br>
        <a href="https://github.com/noyobo">@noyobo</a>
        <p>Webpack Plugins</p>
      </td>
     </tr>
  </tbody>
</table>

---
<a href="https://weex-project.io/">
  <img alt="Weex Logo" src="https://img.alicdn.com/tps/TB1zBLaPXXXXXXeXXXXXXXXXXXX-121-59.svg" width="200">
</a>

**[⬆ back to top](#top)**
