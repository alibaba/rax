<p align="center">
  <a href="https://alibaba.github.io/rax">
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
  <a href="https://travis-ci.org/alibaba/rax"><img src="https://travis-ci.org/alibaba/rax.svg?branch=master"></a>
</p>

---

<p align="center">
Community
</p>

* [![Join the chat at https://gitter.im/alibaba/rax](https://badges.gitter.im/alibaba/rax.svg)](https://gitter.im/alibaba/rax?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  

* [Stack Overflow](http://stackoverflow.com/questions/tagged/rax)

* [中文论坛](http://react-china.org/c/rax)

* <details>
  <summary>钉钉群</summary>
  <a href="http://qr.dingtalk.com/action/joingroup?code=v1,k1,CP2dPkf6aojTT2QdsLM1GK4vDw4x3Q3UMdC96zOTGWzA09r+RLlVDuyQIAt5L+xqo/WU2LKsFRUYCTNKl7J/riENfO/4JdpdPsdf2DCoeF8tH9f9QvubrOUvmN6NriqFXtEUb0fp/hjJPUzBWCyDJCM63BVN7p2I"><img alt="Join the chat at dingtalk" src="https://cloud.githubusercontent.com/assets/677114/23734081/a3651cd6-04b7-11e7-8290-11fb20b722b4.png"></a>
</details>

---

Rax is a universal JavaScript library with a largely React-compatible API. If you use React, you already know how to use Rax.

:zap: **Fast:** blazing fast virtual DOM.

:dart: **Tiny:** 8.0 KB minified + gzipped.

:art: **Universal:** works in browsers, Weex, Node.js and could works more container that implement [driver specification](./docs/en-US/driver-spec.md).

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
import Text from 'rax-text';

class Hello extends Component {
  render() {
    return [
      <Text style={styles.title}>Hello Rax</Text>,
      <Text style={styles.title}>Hello {this.props.name}</Text>,
    ];
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
* [Canvas](/examples/canvas)
* [Charts](/examples/charts)
* [Drag](/examples/drag)
* [Animated](/examples/animated)
* [Profile](/examples/profile)
* [Parallax](/examples/parallax)

## Rax Renderers

* :traffic_light: [rax-test-renderer](/packages/rax-test-renderer): Rax renderer for snapshot testing.
* :computer: [rax-server-renderer](/packages/rax-server-renderer): Rax renderer for server-side render.

## Rax Drivers
* :earth_asia: [driver-browser](/packages/driver-browser): A driver for webkit browser.
* :bullettrain_front: [driver-weex](/packages/driver-weex): A driver for weex container.
* :tractor: [driver-server](/packages/driver-server): A driver for server-side render.
* :bus: [driver-webgl](/packages/driver-webgl): A driver for 3d render.

## Compatible with React Components

Usage with Webpack or Babel makes React-based components work with Rax, without any code changes.

#### Usage with Webpack

Add an alias for `react` and `react-dom`:

```js
{
  // ...
  resolve: {
    alias: {
      'react': 'rax',
      'react-dom': 'rax-dom',
      // Not necessary unless you consume a module using `createClass`
      'create-react-class': "rax/lib/createClass"
    }
  }
  // ...
}
```
#### Usage with Babel

Install the babel plugin for aliasing: `npm install --save-dev babel-plugin-module-resolver`

Add an alias for `react` and `react-dom` in your .babelrc:

```js
{
  // ...
  "plugins": [
    ["module-resolver", {
      "root": ["."],
      "alias": {
        "react": "rax",
        "react-dom": "rax-dom",
        // Not necessary unless you consume a module using `createClass`
        "create-react-class": "rax/lib/createClass"
      }
    }]
  ]
  // ...
}
```

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
<a href="https://weex.apache.org/">
  <img alt="Weex Logo" src="https://img.alicdn.com/tps/TB1zBLaPXXXXXXeXXXXXXXXXXXX-121-59.svg" width="200">
</a>

**[⬆ back to top](#top)**
