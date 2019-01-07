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
  <a href="https://unpkg.com/rax/dist/rax.min.js"><img src="https://img.badgesize.io/https://unpkg.com/rax@beta/dist/rax.min.js?compression=gzip" alt="gzip size"></a>
</p>

---

:zap: **Fast:** blazing fast virtual DOM.

:dart: **Tiny:** ~8 KB minified + gzipped.

:art: **Universal:** works with DOM, Weex, Node.js, Mini-program, WebGL and could works more container that implement [driver specification](./docs/en-US/driver-spec.md).

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

### With JSX(XML-like syntax extension to ECMAScript)
> Each JSX element is just syntactic sugar for calling `createElement(component, props, ...children)`. So, anything you can do with JSX can also be done with just plain JavaScript.

```jsx
// Hello.jsx
import {createElement, useState} from 'rax';

export default (props) => {
  const [name, setName] = useState('world');
  const handleClick = () = {
    setName('rax');
  };
  return (
    <view style={styles.hello}>
      <text style={styles.title} onClick={this.handleClick}>
      Hello {name}
      </text>
    </view>
  );
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
import {render} from 'rax-dom';
import Hello from './Hello';

render(<Hello name="world" />);
```

## Rax API (v1.0)

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
* useImperativeMethods()
  ```jsx
  function FancyInput(props, ref) {
    const inputRef = useRef();
    useImperativeMethods(ref, () => ({
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
* render(element [, container] [, callback])
  ```jsx
  render(<HelloMessage name="world" />)
  ```

#### Version
* version

#### rax-dom
* render()

#### rax-weex
* render()

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

#### rax-clone-elment
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

## Rax Legacy API (v1.0)

#### rax-component
* Component

#### rax-pure-component
* PureComponent

#### rax-create-class
* createClass()


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
