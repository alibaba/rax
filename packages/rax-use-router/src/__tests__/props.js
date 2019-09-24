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

describe('route props', () => {
  beforeEach(function() {
    delete require.cache;
    jest.useFakeTimers();
  });

  afterEach(function() {
    jest.useRealTimers();
  });

  it('should have history and location.', function() {
    const { createElement, render } = require('rax');
    const createMemoryHistory = require('history').createMemoryHistory;

    const { useRouter, withRouter } = require('..');
    const container = createNodeElement('div');
    const history = createMemoryHistory();

    // withRouter test
    function Link(props) {
      return <a onClick={() => props.history.push('/')}>go root</a>;
    }
    const WrappedLink = withRouter(Link);

    const config = () => {
      return {
        history,
        routes: [
          {
            path: '/',
            component: (props) => {
              return (
                <button onClick={() => props.history.push('/foo')}>go foo</button>
              );
            },
          },
          {
            path: '/foo',
            component: (props) => {
              return <WrappedLink />;
            },
          },
        ]
      };
    };
    function Example() {
      var { component } = useRouter(config);
      return component;
    }

    render(<Example />, container, { driver: DriverServer });

    history.push('/');
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('go foo');

    // push "/foo"
    container.childNodes[0].eventListeners.click();
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('go root');

    // push "/"
    container.childNodes[0].eventListeners.click();
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('go foo');
  });
});
