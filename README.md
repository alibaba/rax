<p align="center">
  <a href="https://alibaba.github.io/rax">
    <img alt="Rax" src="https://user-images.githubusercontent.com/677114/49848760-999e7d00-fe11-11e8-978f-264ea31f6739.png" width="66">
  </a>
</p>

<p align="center">
The fastest way to build universal application.
</p>

<p align="center">
  <a href="https://github.com/alibaba/rax/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/rax.svg"></a>
  <a href="https://www.npmjs.com/package/rax"><img src="https://img.shields.io/npm/v/rax.svg"></a>
  <a href="https://www.npmjs.com/package/rax"><img src="https://img.shields.io/npm/dm/rax.svg"></a>
  <a href="https://travis-ci.org/alibaba/rax"><img src="https://travis-ci.org/alibaba/rax.svg?branch=master"></a>
  <a href="https://unpkg.com/rax/dist/rax.min.js"><img src="https://img.badgesize.io/https://unpkg.com/rax/dist/rax.min.js?compression=gzip&?maxAge=3600" alt="gzip size"></a>
</p>

---

:christmas_tree: **Familiar:** React compatible API with Class Component and Hooks.

:candy: **Tiny:** ~7 KB minified + gzipped.

:earth_asia: **Universal:** works with DOM, Weex, Node.js, Mini-program, WebGL and could work more container that implements [driver specification](./docs/en-US/driver-spec.md).

:banana: **Easy:** using via `rax-cli` with zero configuration, one codebase with universal UI toolkit & APIs.

:lollipop: **Friendly:** developer tools for Rax development.

---

- [Quick Start](#getting-started)
  - [Install via NPM](#install-via-npm)
  - [Using via CLI](#using-via-cli)
  - [Using via CDN](#using-via-cdn)
- [Guides](#guides)
  - [Server-side rendering and hydration](#server-side-rendering-and-hydration)
  - [App Router](#app-router)
  - [Fetch Data](#fetch-data)
  - [Asynchronous Operation](#asynchronous-operation)
  - [Code Splitting](#code-splitting)
  - [Testing](#testing)
  - [Developer Tools](#developer-tools)
  - [React compatibility](#react-compatibility)
  - [Use TypeScript](#use-typescript)
- [API Reference](#api-reference)
  - [render()](#rendering-elements)
  - [createElement()](#creating-elements)
  - [createRef()](#refs)
  - [forwardRef()](#refs)
  - [memo()](#performance)
  - [Hooks](#hooks)
    - [useState()](#hooks)
    - [useEffect()](#hooks)
    - [useLayoutEffect()](#hooks)
    - [useRef()](#hooks)
    - [useContext()](#hooks)
    - [useCallback()](#hooks)
    - [useReducer()](#hooks)
    - [useImperativeHandle()](#hooks)
    - [useMemo()](#hooks)
  - [Fragment](#fragments)
  - [Component](#class-component)
  - [PureComponent](#class-component)
  - [version](#version)
  - [rax-children](#rax-children)
  - [rax-hydrate](#rax-hydrate)
  - [rax-proptypes](#rax-proptypes)
  - [rax-is-valid-element](#rax-proptypes)
  - [rax-clone-element](#rax-clone-element)
  - [rax-create-factory](#rax-create-factory)
  - [rax-find-dom-node](#rax-find-dom-node)
  - [rax-unmount-component-at-node](#rax-unmount-component-at-node)
---

## Quick Start

### Install via NPM
Quickly add rax to your project:

```sh
$ npm install rax
$ npm install driver-dom
```

#### Starter template
```jsx
// Hello.jsx
import {createElement, useState} from 'rax';

export default (props) => {
  const [name, setName] = useState(props.name);
  const handleClick = () => {
    setName('rax');
  };
  return (
    <h1 onClick={handleClick}> Hello {name}</h1>
  );
}
```

```js
// app.jsx
import {render} from 'rax';
import DriverDOM from 'driver-dom';
import Hello from './Hello';

render(<Hello name="world" />, document.body, { driver: DriverDOM });
```

### Using via CLI
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

### Using via CDN

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World</title>
    <script src="https://unpkg.com/rax@1.0.0/dist/rax.js"></script>
    <script src="https://unpkg.com/driver-dom@1.0.0/dist/driver-dom.js"></script>
    
    <!-- Don't use this in production: -->
    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      // @jsx Rax.createElement
      Rax.render(
        <h1>Hello, world!</h1>,
        document.getElementById('root'),
        { driver: DriverDOM }
      );
    </script>
  </body>
</html>
```

## Guides

### Server-side rendering and hydration

Use `renderToString()` to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

```jsx
// MyComponent.jsx
function MyComponent(props) {
  return <h1>Hello world</h1>;
}
```

```js
import express from 'express';
import renderer from 'rax-server-renderer';
import {createElement} from 'rax';
import MyComponent from './MyComponent';

const app = express();
app.listen(8080);

app.get('/hello', (req, res) => {
  let html = renderer.renderToString(createElement(MyComponent));
  res.send(`<!DOCTYPE html><html><body>${html}</body></html>`);
});
```

If you call `hydrate()` on a node that already has this server-rendered markup, Rax will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```js
import hydrate from 'rax-hydrate';
import MyComponent from './MyComponent';

hydrate(<MyComponent />, document.body);
```

### App Router

Use `useRouter` to config routing rules, each route map to a component.

```jsx
import { createElement, Fragment } from 'rax';
import { useRouter, push } from 'rax-use-router';
import { createHashHistory } from 'history';
import Foo from './Foo';
import NotFound from './NotFound';

const config = () => {
  return {
    history: createHashHistory(),
    routes: [
      // Static Component
      {
        path: '',
        component: <>
          <button onClick={() => push('/home')}>go home</button>
          <button onClick={() => push('/404')}>go 404</button>
        </>,
      },
      {
        path: '/home',
        routes: [
          // Dynamic Component 
          {
            path: '',                  // www.example.com/home
            component: () => <>
              <button onClick={() => push('/foo')}>go foo</button>
              <button onClick={() => push('/bar')}>go bar</button>
              <button onClick={() => push('/home/jack')}>go jack</button>
            </>,
          },
          // URL Parameters
          {
            path: '/:username',        // www.example.com/home/xxx
            component: (params) => <>
              <p>{params.username}</p>
              <button onClick={ () => push('/home') }>Go home</button>
            </>
          }
        ]
      },
      // Code Splitting
      {
        path: '/bar',
        routes: [
          {
            path: '',                 // www.example.com/bar
            component: () => import(/* webpackChunkName: "bar" */ './Bar').then((Bar) => {
              // interop-require see: https://www.npmjs.com/package/interop-require
              Bar = Bar.__esModule ? Bar.default : Bar;
              // return a created element
              return <Bar />;
            }),
          },
        ],
      },
      {
        path: '/foo',                 // www.example.com/foo
        component: () => <Foo />,  
      },
      // No match (404)
      {
        component: () => <NotFound />,
      }
    ]
  }
};

export default function Example() {
  const { component } = useRouter(config);
  return component;
}
```

```jsx
// Foo.jsx
import { createElement } from 'rax';
import { push } from 'rax-use-router';

export default function Foo() {
  return <button onClick={ () => push('/home') }>Go home</button>
}
```

```jsx
// Bar.jsx
import { createElement } from 'rax';
import { push } from 'rax-use-router';

export default function Bar() {
  return <button onClick={ () => push('/home') }>Go home</button>
}
```

```jsx
// NotFound.jsx
import { createElement } from 'rax';
import { replace } from 'rax-use-router';

export default function NotFound() {
  return <button onClick={ () => replace('/home') }>Go home</button>
}
```

### Asynchronous Operation
```jsx
import { createElement, useMemo } from 'rax';
import usePromise from 'rax-use-promise';

const fetchData = () => fetch('https://httpbin.org/get').then(res => res.json());

function Example() {
  const [data, error] = usePromise(useMemo(fetchData));
  if (error) {
    return <p>error</p>
  } else if (data) {
    return <p>{data.foo}</p>
  }
}
```

### Fetch Data
```jsx
import { createElement } from 'rax';
import useFetch from 'rax-use-fetch';

function Example() {
  const [data, error] = useFetch('https://httpbin.org/get');
  if (error) {
    return <p>error</p>;
  } else if (data) {
    return <p>{data.foo}</p>;
  } else {
    return <p>loading</p>;
  }
}
```

### Code Splitting

Code-Splitting allows you to split your code into various bundles which can then be loaded on demand or in parallel. It can be used to achieve smaller bundles and control resource load prioritization which, if used correctly, can have a major impact on load time.

Code-Splitting is supported by `Webpack` which can create multiple bundles that can be dynamically loaded at runtime.

```jsx
import { createElement } from 'rax';
import useImport from 'rax-use-import';

export default function App() {
  const [Bar, error] = useImport(() => import(/* webpackChunkName: "bar" */ './Bar'));
  if (error) {
    return <p>error</p>;
  } else if (Bar) {
    return <Bar />
  } else {
    return <p>loading</p>;
  }
}
```

### Testing

`rax-test-renderer` provides an renderer that can be used to render Rax components to pure JavaScript objects, without depending on the DOM or a native mobile environment:

```jsx
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';

const tree = renderer.create(
  <Link page="https://example.com/">Example</Link>
);

console.log(tree.toJSON());
// { tagName: 'A',
//   attributes: { href: 'https://example.com/' },
//   children: [ 'Example' ] }
```

You can also use Jest's snapshot testing feature to automatically save a copy of the JSON tree to a file and check in your tests that it hasn't changed: http://facebook.github.io/jest/blog/2016/07/27/jest-14.html.

```jsx
import {createElement} from 'rax';
import renderer from 'rax-test-renderer';

test('Link renders correctly', () => {
  const tree = renderer.create(
    <Link page="https://example.com">Example</Link>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
```

### Developer Tools

You can inspect and modify the state of your Rax components at runtime using the
[React Developer Tools](https://github.com/facebook/react-devtools) browser extension.

1. Install the [React Developer Tools](https://github.com/facebook/react-devtools) extension
2. Import the "rax/lib/devtools" module in your app
  ```js
  import 'rax/lib/devtools';
  ```
3. Set `process.env.NODE_ENV` to 'development'
4. Reload and go to the 'React' tab in the browser's development tools


### React compatibility

Add an alias for `react` and `react-dom` in webpack config that makes React-based modules work with Rax, without any code changes:

```
{
  // ...
  resolve: {
    alias: {
      'react': 'rax/lib/compat',
      'react-dom': 'rax-dom'
    }
  }
  // ...
}
```

### Use TypeScript

Install TypeScript:
```sh
$ npm install typescript --save-dev
```

Install TypeScript loader for webpack:

```sh
$ npm install ts-loader --save-dev
```

Create or update `webpack.config.js`:
```js
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./app.tsx",
  output: {
    filename: "bundle.js"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
};
```

Add a `tsconfig.json` file:
```json
{
  "compilerOptions": {
    "sourceMap": true,
    "jsx": "react",
    "jsxFactory": "createElement"
  }
}
```

Write your first TypeScript file using Rax:

```tsx
// app.tsx
import { createElement, render } from 'rax';
import * as DriverDOM from 'driver-dom';

interface HelloProps { compiler: string; framework: string; }

const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

render(<Hello compiler="TypeScript" framework="React" />, document.body, { driver: DriverDOM});
```

## API Reference

#### Creating Elements
* createElement(type, [props], [...children])
 ```jsx
 createElement('div', { id: 'foo' }, createElement('p', null, 'hello world'));
 ```

#### Fragments
* Fragment
  ```jsx
  <Fragment>
    <header>A heading</header>
    <footer>A footer</footer>
  </Fragment>
  ```

#### Refs
* createRef()
  ```jsx
  const inputRef = createRef();
  function MyComponent() {
    return <input type="text" ref={inputRef} />;
  }
  ```
* forwardRef()
  ```jsx
  const MyButton = forwardRef((props, ref) => (
    <button ref={ref}>
      {props.children}
    </button>
  ));

  // You can get a ref directly to the DOM button:
  const ref = createRef();
  <MyButton ref={ref}>Click me!</MyButton>;
  ```

#### Hooks
* useState()
  ```jsx
  function Example() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }
  ```
* useEffect()
  ```jsx
  function Example() {
    const [count, setCount] = useState(0);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
      document.title = `You clicked ${count} times`;
    });

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }
  ```
* useLayoutEffect()
  ```jsx
  function Example() {
    const [count, setCount] = useState(0);

    useLayoutEffect(() => {
      // Fires in the same phase as componentDidMount and componentDidUpdate
    });

    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }
  ```
* useContext()
  ```jsx
  // Create a Context
  const NumberContext = createContext();

  function Example() {
    const value = useContext(NumberContext);
    return <div>The answer is {value}.</div>;
  }
  ```
* useRef()
  ```jsx
  function TextInputWithFocusButton() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
      // `current` points to the mounted text input element
      inputEl.current.focus();
    };
    return (
      <>
        <input ref={inputEl} type="text" />
        <button onClick={onButtonClick}>Focus the input</button>
      </>
    );
  }
  ```
* useCallback()
  ```jsx
  const memoizedCallback = useCallback(
    () => {
      doSomething(a, b);
    },
    [a, b],
  );
  ```
* useMemo()
  ```jsx
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```
* useReducer()
  ```jsx
  const initialState = {count: 0};

  function reducer(state, action) {
    switch (action.type) {
      case 'reset':
        return initialState;
      case 'increment':
        return {count: state.count + 1};
      case 'decrement':
        return {count: state.count - 1};
      default:
        // A reducer must always return a valid state.
        // Alternatively you can throw an error if an invalid action is dispatched.
        return state;
    }
  }

  function Counter({initialCount}) {
    const [state, dispatch] = useReducer(reducer, {count: initialCount});
    return (
      <>
        Count: {state.count}
        <button onClick={() => dispatch({type: 'reset'})}>
          Reset
        </button>
        <button onClick={() => dispatch({type: 'increment'})}>+</button>
        <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      </>
    );
  }
  ```
* useImperativeHandle()
  ```jsx
  function FancyInput(props, ref) {
    const inputRef = useRef();
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus();
      }
    }));
    return <input ref={inputRef} />;
  }
  FancyInput = forwardRef(FancyInput);
  ```

#### Performance
* memo()
  ```jsx
  function MyComponent(props) {
    /* render using props */
  }
  function areEqual(prevProps, nextProps) {
    /* 
      return true if passing nextProps to render would return
      the same result as passing prevProps to render,
      otherwise return false
    */
  }
  export default memo(MyComponent, areEqual);
  ```

#### Rendering Elements
* render(element [, container] [, options] [, callback])
  ```jsx
  render(<HelloMessage name="world" />, document.body, { driver: DomDriver })
  ```

#### Class Component
* Component
* PureComponent

#### Version
* version

#### rax-children
* Children
  * Children.map(children, function[(thisArg)])
  * Children.forEach(children, function[(thisArg)])
  * Children.count(children)
  * Children.only(children)
  * Children.toArray(children)

#### rax-proptypes
* PropTypes
  * PropTypes.array
  * PropTypes.bool
  * PropTypes.func
  * PropTypes.number
  * PropTypes.object
  * PropTypes.string
  * PropTypes.symbol
  * PropTypes.element
  * PropTypes.node
  * PropTypes.any
  * PropTypes.arrayOf
  * PropTypes.instanceOf
  * PropTypes.objectOf
  * PropTypes.oneOf
  * PropTypes.oneOfType
  * PropTypes.shape

#### rax-is-valid-element
* isValidElement(object)

#### rax-clone-element
* cloneElement(element, [props], [...children])

#### rax-create-factory
* createFactory(type)

#### rax-create-portal
* createPortal(child, container)

#### rax-hydrate
* hydrate(element, container[, callback])

#### rax-find-dom-node
* findDOMNode(component)

#### rax-unmount-component-at-node
* unmountComponentAtNode(container)

## Legacy API

#### rax-create-class
* createClass()

## Contributing

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [guidelines for contributing](./.github/CONTRIBUTING.md).

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
