import { createElement, Fragment } from 'rax';
import { useRouter, push } from 'rax-use-router';
import { createHashHistory } from 'history';

function interopRequire(obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

const config = () => {
  return {
    history: createHashHistory(),
    routes: [
      // Static Component
      {
        path: '',
        component: () => import(/* webpackChunkName: "pages.index" */ '../src/pages/index')
          .then(interopRequire)
          .then(Index => <Index />)
      },
      {
        path: '/home',
        routes: [
          // Dynamic Component
          {
            path: '', // www.example.com/home
            component: () => import(/* webpackChunkName: "pages.index" */ '../src/pages/index')
              .then(interopRequire)
              .then(Index => <Index />)
          },
        ]
      },
      // Code Splitting
      {
        path: '/bar',
        routes: [
          {
            path: '', // www.example.com/bar
            component: () => import(/* webpackChunkName: "pages.bar" */ '../src/pages/bar')
              .then(interopRequire)
              .then(Bar => <Bar />)
          },
        ],
      },
      {
        path: '/foo', // www.example.com/foo
        component: () => import(/* webpackChunkName: "pages.foo" */ '../src/pages/foo')
          .then(interopRequire)
          .then(Foo => <Foo />)
      },
      // Error
      {
        component: () => import(/* webpackChunkName: "pages.error" */ '../src/pages/_error')
          .then(interopRequire)
          .then(Error => <Error />)
      }
    ]
  };
};

export default function Example() {
  const { component } = useRouter(config);
  return component;
}