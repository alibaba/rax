# rax-use-router


### Usage
```
npm i rax-use-router --save
```

### Example

```jsx
import { createElement, Fragment } from 'rax';
import { route, useComponent, push } from 'rax-use-router';
import Foo from './Foo';

route([{
  path: '/home',
  routes: [
    {
      path: '',                   // www.example.com/home
      component: () => <>
        <button onClick={() => push('/foo')}>go foo</button>
        <button onClick={() => push('/bar')}>go bar</button>
        <button onClick={() => push('/home/jack')}>go jack</button>
      </>,
    },
    {
      path: '/:username',         // www.example.com/home/xxx
      component: (params) => <>
        <p>{params.username}</p>
        <button onClick={ () => push('/home') }>Go home</button>
      </>
    }
  ]},
  {
    path: '/bar',
    routes: [
      {
        path: '',                 // www.example.com/bar
        component: () => import(/* webpackChunkName: "bar" */ './Bar'),
      },
    ],
  },
  {
    path: '/foo',                 // www.example.com/foo
    component: () => <Foo />,  
  },
]);

export default function Example() {
  var component = useComponent('/home');
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
