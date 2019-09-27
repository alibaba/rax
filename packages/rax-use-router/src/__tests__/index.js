import DriverServer from 'driver-server';

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

describe('router', () => {
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

    const { useRouter } = require('../');
    const container = createNodeElement('div');
    const history = createMemoryHistory();

    const config = () => {
      return {
        history,
        routes: [
          {
            path: '/home',
            routes: [
              {
                path: '',
                component: () => <p>home</p>
              },
              {
                path: '/:username',
                component: (props) => <p>{props.username}</p>
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

    history.push('/home');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('home');

    history.push('/foo');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('foo');

    history.push('/home/jack');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('jack');

    history.push('/foo');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('foo');

    history.push('/home');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('home');

    history.push('/home/rose');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('rose');
  });
});

