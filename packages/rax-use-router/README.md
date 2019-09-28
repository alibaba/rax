# rax-use-router


## Usage
```
npm i rax-use-router --save
```

## Example

Use `useRouter` to config routing rules, each route map to a component.
All route props (location and history) are available to User.

```jsx
import { createElement, Fragment } from 'rax';
import { useRouter } from 'rax-use-router';
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
          <h1>Hello</h1>
        </>,
      },
      {
        path: '/home',
        routes: [
          // Dynamic Component 
          {
            path: '',                  // www.example.com/home
            component: (props) => {
              return (
                <>
                  <button onClick={() => props.history.push('/foo')}>go foo</button>
                  <button onClick={() => props.history.push('/bar')}>go bar</button>
                  <button onClick={() => props.history.push('/home/jack')}>go jack</button>
                </>
              )
            },
          },
          // URL Parameters
           {
            path: '/:username',        // www.example.com/home/xxx
            component: (props) => {
              return (
                <>
                  <p>{props.username}</p>
                  <button onClick={() => props.history.push('/home')}>Go home</button>
                </>
              )
            }
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
import { withRouter } from 'rax-use-router';

function Foo(props) {
  return <button onClick={ () => props.history.push('/home') }>Go home</button>
}
export default withRouter(Foo);
```

```jsx
// Bar.jsx
import { createElement } from 'rax';
import { withRouter } from 'rax-use-router';

function Bar(props) {
  return <button onClick={ () => props.history.push('/home') }>Go home</button>
}
export default withRouter(Bar);
```

```jsx
// NotFound.jsx
import { createElement } from 'rax';
import { withRouter } from 'rax-use-router';

function NotFound(props) {
  return <button onClick={ () => props.history.replace('/home') }>Go home</button>
}
export default withRouter(NotFound);
```

## API Reference

### useRouter({ history, routes })

#### `history`
[`history`](https://github.com/ReactTraining/history) provides 3 different methods for creating a `history` object, depending on your environment.
  - `createBrowserHistory` is for use in modern web browsers that support the [HTML5 history API](http://diveintohtml5.info/history.html) (see [cross-browser compatibility](http://caniuse.com/#feat=history))
  - `createMemoryHistory` is used as a reference implementation and may also be used in non-DOM environments, like [React Native](https://facebook.github.io/react-native/) or tests
  - `createHashHistory` is for use in legacy web browsers


#### `routes`

Route options:

##### path

Any valid URL path or array of paths that [`path-to-regexp@^1.7.0`](https://github.com/pillarjs/path-to-regexp/tree/v1.7.0) understands.

```jsx
{
  path: '/users/:id',
  component: () => <User />,  
}
```

When doesn’t match any of routes, if there a route without a `path` will match that rule, just like a 404.

```jsx
{
  component: () => <NotFound />,  
}
```

##### component

A component to render when the location matches.

```jsx
{
  path: '/:username',        // www.example.com/home/xxx
  component: (props) => {
    return (
      <>
        <p>{props.username}</p>
        <button onClick={() => props.history.push('/home')}>Go home</button>
      </>
    )
  }
}
```

##### exact

Default `true`, when `false`, will not match if the path matches the `location.pathname` _exactly_.

```jsx
{
  path: '/foo',
  exact: false,
  component: () => <Foo />,  
}
```

| path   | location.pathname | exact   | matches? |
| ------ | ----------------- | ------- | -------- |
| `/foo` | `/foo/bar`        | `true`  | no       |
| `/foo` | `/foo/bar`        | `false` | yes      |

##### strict

Default `false`, when `true`, a `path` that has a trailing slash will only match a `location.pathname` with a trailing slash. This has no effect when there are additional URL segments in the `location.pathname`.

```jsx
{
  path: '/foo',
  strict: true,
  component: () => <Foo />,
}
```

| path    | location.pathname | matches? |
| ------- | ----------------- | -------- |
| `/foo/` | `/foo`            | no       |
| `/foo/` | `/foo/`           | yes      |
| `/foo/` | `/foo/bar`        | yes      |

**Warning:** `strict` can be used to enforce that a `location.pathname` has no trailing slash, but in order to do this both `strict` and `exact` must be `true`.

```jsx
{
  path: '/foo',
  exact: true,
  strict: true,
  component: () => <Foo />,
}
```

| path   | location.pathname | matches? |
| ------ | ----------------- | -------- |
| `/foo` | `/foo`            | yes      |
| `/foo` | `/foo/`           | no       |
| `/foo` | `/foo/bar`        | no       |

##### sensitive

Default `false`, when `true`, will match if the path is **case sensitive**.

```jsx
{
  path: '/foo',
  sensitive: ture,
  component: () => <Foo />,  
}
```

| path   | location.pathname | sensitive | matches? |
| ------ | ----------------- | --------- | -------- |
| `/foo` | `/foo`            | `true`    | yes      |
| `/foo` | `/Foo`            | `false`   | yes      |
| `/Foo` | `/foo`            | `true`    | no       |
| `/foo` | `/Foo`            | `true`    | no       |

### withRouter(Componet)
withRouter will pass updated location, and history props to the wrapped component whenever it renders.
```jsx
// Foo.jsx
import { createElement } from 'rax';
import { withRouter } from 'rax-use-router';

function Foo(props) {
  const {history, location} = props;
  return <button onClick={ () => history.push('/home') }>{location.pathname}</button>
}
export default withRouter(Foo);
```

#### history

Each `history` object has the following properties:

- `history.length` - The number of entries in the history stack.
- `history.location` - The current location (see below).
- `history.action` - The current navigation action, such as push, replace, go and so on.

For more information, see [history](https://www.npmjs.com/package/history)

#### location 

The `location` object implements a subset of [the `window.location` interface](https://developer.mozilla.org/en-US/docs/Web/API/Location), including:

- `location.pathname` - The path of the URL
- `location.search` - The URL query string
- `location.hash` - The URL hash fragment

For more information, see [history](https://www.npmjs.com/package/history)