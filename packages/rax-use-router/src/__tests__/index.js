import DriverServer from 'driver-server';

describe('router', () => {
  function createNodeElement(tagName) {
    return {
      nodeType: 1,
      tagName: tagName.toUpperCase(),
      attributes: {},
      style: {},
      childNodes: [],
      parentNode: null
    };
  }

  beforeEach(function() {
    jest.useFakeTimers();
  });

  afterEach(function() {
    jest.useRealTimers();
  });

  it('should clone a DOM component with new props', function() {
    // HACK: require here for hijack timers in rax
    const { createElement, render, Fragment } = require('rax');
    const createMemoryHistory = require('history').createMemoryHistory;

    const { useRouter, push } = require('../');
    const container = createNodeElement('div');
    const config = () => {
      return {
        history: createMemoryHistory(),
        routes: [
          {
            path: '/home',
            routes: [
              {
                path: '',
                component: () => <p>home</p>,
              },
              {
                path: '/:username',
                component: (params) => <p>{params.username}</p>
              }
            ]
          },
          {
            path: '/foo',
            component: () => <p>foo</p>,
          },
        ]
      };
    };

    function Example() {
      var { component } = useRouter(config);
      return component;
    }

    render(<Example />, container, { driver: DriverServer });
    push('/home');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('home');

    push('/foo');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('foo');

    push('/home/jack');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('jack');

    push('/foo');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('foo');

    push('/home');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('home');

    push('/home/rose');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('rose');
  });
});
