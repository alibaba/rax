<p align="center">
  <a href="https://alibaba.github.io/rax">
    <img alt="Rax" src="https://user-images.githubusercontent.com/677114/49848760-999e7d00-fe11-11e8-978f-264ea31f6739.png" width="66">
  </a>
</p>

<p align="center">
[🚧 Work In Progress v1.0] The fastest way to build cross-container application.
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
  <a href="https://qr.dingtalk.com/action/joingroup?code=v1,k1,kvz0NeXx/rsf/3KhrDQU9J1ZxS0DvkGbL8vvKpCsm04=&_dt_no_comment=1&origin=11"><img alt="Join the chat at dingtalk" src="https://user-images.githubusercontent.com/677114/41036929-486fd78a-69c4-11e8-9eb7-cd69b89821c1.png"></a>
</details>

---

:zap: **Fast:** blazing fast virtual DOM.

:dart: **Tiny:** 12.6 KB minified + gzipped.

:art: **Universal:** works in browsers, Weex, Node.js, Mini-program, WebGL and could works more container that implement [driver specification](./docs/en-US/driver-spec.md).

## Quick Start

Install the Rax CLI tools to init project:

```sh
$ npm install rax-cli -g
$ rax init <YourProjectName>
```

Start local server to launch project:
```sh
$ cd YourProjectName
$ npm run start
```

## Rax API (v1.0)

#### Creating Elements
* createElement()
* createFactory()

#### Manipulating Elements
* cloneElement()
* isValidElement()
* Children

#### Fragments
* Fragment

#### Refs
* createRef()
* forwardRef()

#### Hooks
* useState()
* useContext()
* useEffect()
* useLayoutEffect()
* useRef()
* useCallback()
* useMemo()
* useReducer()
* useImperativeMethods()

#### Performance
* memo()

#### Rendering Elements
* render()
* hydrate()

## Project Type Support
* WebApp Project
```
.
├── package.json
├── .gitignore
├── .eslintrc.js
├── src
│   └── index.js
└── public
    └── index.html
```
* MiniApp Project
```
.
├── manifest.json
├── package.json
├── .gitignore
├── .eslintrc.js
├── src
│   ├── app.js
│   ├── app.css
│   ├── pages
│   │   ├── page1.html
│   │   └── page2.html
│   └── components
│       ├── component1.html
│       └── component2.html
└── public
    └── index.html
```
* Mini Program Project
```
.
├── app.js
├── app.acss
├── app.json
├── package.json
├── .gitignore
├── .eslintrc.js
└── pages
    ├── page1
    │   ├── page1.acss
    │   ├── page1.axml
    │   ├── page1.js
    │   └── page1.json
    └── page2
        ├── page2.acss
        ├── page2.axml
        ├── page2.js
        └── page2.json
```

## DSL Support

* JSX(XML-like syntax extension to ECMAScript) DSL
* SFC(Single File Component) DSL
* MP(Mini Program) DSL

### JSX(XML-like syntax extension to ECMAScript) DSL
> Each JSX element is just syntactic sugar for calling `createElement(component, props, ...children)`. So, anything you can do with JSX can also be done with just plain JavaScript.

```jsx
// Hello.jsx
import {createElement, Component} from 'rax';

export default class extends Component {
  state = {
    name: 'world'
  };
  onChange = ()=>{
    this.setState({
      name: 'rax'
    });
  };
  render() {
    return (
      <view style={styles.hello}>
        <text style={styles.title} onClick={this.onChange}>
        Hello {this.state.name}
        </text>
      </view>
    );
  }
}

const styles = {
  hello: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: '40px',
    textAlign: 'center'
  }
};
```

```js
// app.js
import {render} from 'rax';
import Hello from './Hello';

render(<Hello name="world" />);
```

### SFC(Single File Component) DSL
> SFC is a Vue-like DSL that will compile to rax component.

```html
<!-- hello.html -->
<template>
  <view class="hello">
    <text class="title" @click="change">Hello {{name}}</text>
  </view>
</template>

<script>
  export default {
    data: function () {
      return {
        name: 'world'
      }
    },
    methods: {
      change () {
        this.name = 'rax';
      }
    }
  }
</script>

<style>
  .hello {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: 40px;
    text-align: center;
  }
</style>
```

```js
// app.js
import {render} from 'rax';
import Hello from './hello';

render(<Hello name="world" />);
```

### MP(Mini Program) DSL
> MP DSL will compile to rax component.

```js
Component({
  data: {
    name: 'world'
  },
  methods: {
    onChange(e) {
      this.setData({
        name: 'rax' 
      });
    }
  }
});
```

```css
/* index.acss */
.hello {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 40px;
  text-align: center;
}
```

```html
<!-- index.axml -->
<view class="hello">
  <text class="title" onClick="change">Hello {{name}}</text>
</view>
```

## Rax Renderers

* :traffic_light: [rax-test-renderer](/packages/rax-test-renderer): Rax renderer for snapshot testing.
* :computer: [rax-server-renderer](/packages/rax-server-renderer): Rax renderer for server-side render.

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
      <td align="center" width="80" valign="top">
        <img height="80" src="https://github.com/yuanyan.png?s=128">
        <br>
        <a href="https://github.com/yuanyan">@yuanyan</a>
        <p>Core</p>
      </td>
      <td align="center" width="80" valign="top">
        <img height="80" src="https://github.com/imsobear.png?s=128">
        <br>
        <a href="https://github.com/imsobear">@imsobear</a>
        <p>Development</p>
      </td>
      <td align="center" width="80" valign="top">
        <img height="80" src="https://github.com/yacheng.png?s=128">
        <br>
        <a href="https://github.com/yacheng">@yacheng</a>
        <p>Universals &amp; Components</p>
      </td>
      <td align="center" width="80" valign="top">
        <img height="80" src="https://github.com/boiawang.png?s=128">
        <br>
        <a href="https://github.com/boiawang">@boiawang</a>
        <p>Loaders &amp; Plugins</p>
      </td>
      <td align="center" width="80" valign="top">
        <img height="80" src="https://github.com/wssgcg1213.png?s=128">
        <br>
        <a href="https://github.com/wssgcg1213">@wssgcg1213</a>
        <p>DSL Runtimes &amp; Loaders</p>
      </td>
     </tr>
  </tbody>
</table>


## Users
<p align="center">
  <img src="https://user-images.githubusercontent.com/677114/49876501-81088400-fe5e-11e8-95bc-ee9468a58eec.png" height="60"/>
  <img src="https://user-images.githubusercontent.com/677114/49876598-a7c6ba80-fe5e-11e8-8fe8-d2fc28df69fd.png" height="60"/>
  <img src="https://user-images.githubusercontent.com/677114/49876742-f07e7380-fe5e-11e8-8bfa-ba2c6d0d8536.png" height="60"/>
  <img src="https://user-images.githubusercontent.com/677114/49876872-33404b80-fe5f-11e8-8244-b5598900e3f6.png" height="60"/>
  <img src="https://user-images.githubusercontent.com/677114/49876953-5b2faf00-fe5f-11e8-8789-7f1787495b2a.png" height="60"/>
  <img src="https://user-images.githubusercontent.com/677114/49877220-e8730380-fe5f-11e8-8579-e622b3f0f5a6.png" height="60"/>
  <img src="https://user-images.githubusercontent.com/677114/50414430-84354400-0850-11e9-8352-7c0f44c01561.png" height="60"/>
  <img src="https://user-images.githubusercontent.com/677114/50414676-d88cf380-0851-11e9-9f20-307ae81ef5eb.png" height="60"/>
  <img src="https://user-images.githubusercontent.com/677114/50414379-43d5c600-0850-11e9-8dc6-133465db54dc.png" height="60"/>
</p>

---
**[⬆ back to top](#top)**
