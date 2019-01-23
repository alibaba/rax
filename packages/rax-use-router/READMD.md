# rax-use-router

```jsx
import { createElement, Fragment } from 'rax';
import { useRouter, push } from 'rax-use-router';
import Foo from './Foo';

const routes = [{
  path: '/home',
  children: [
    {
      path: '',                   // www.example.com/home
      action: () => <>
        <button onClick={() => push('/foo')}>go foo</button>
        <button onClick={() => push('/bar')}>go bar</button>
        <button onClick={() => push('/home/jack')}>go jack</button>
      </>,
    },
    {
      path: '/:username',         // www.example.com/home/xxx
      action: (params) => <>
        <p>{params.username}</p>
        <button onClick={ () => push('/home') }>Go home</button>
      </>
    }
  ]},
  {
    path: '/bar',
    children: [
      {
        path: '',                 // www.example.com/bar
        action: () => import(/* webpackChunkName: "bar" */ './Bar'),
      },
    ],
  },
  {
    path: '/foo',                 // www.example.com/foo
    action: () => <Foo />,  
  },
];

export default function Example() {
  var component = useRouter(routes, '/home');
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
