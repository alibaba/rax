/* @jsx createElement */

import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import Component from '../vdom/component';

describe('render', () => {
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
    Host.driver = ServerDriver;
    jest.useFakeTimers();
  });

  afterEach(function() {
    Host.driver = null;
    jest.useRealTimers();
  });

  it('render to default container', () => {
    let appendChildMock = jest.fn();

    Host.driver = {
      createElement() {
        return {tagName: 'DIV'};
      },
      createBody() {
        return {tagName: 'BODY'};
      },
      appendChild: appendChildMock
    };

    render(<div />);

    let call = appendChildMock.mock.calls[0];
    expect(call[0].tagName).toBe('DIV');
    expect(call[1].tagName).toBe('BODY');
  });

  it('should render different components in same root', function() {
    let container = createNodeElement('container');

    render(<div />, container);
    expect(container.childNodes[0].tagName).toBe('DIV');

    render(<span />, container);
    expect(container.childNodes[0].tagName).toBe('SPAN');
  });

  it('should reuse markup if rendering to the same target twice', function() {
    let container = createNodeElement('container');
    let instance1 = render(<div />, container);
    let instance2 = render(<div />, container);

    expect(instance1 === instance2).toBe(true);
  });

  it('should trigger afterRender twice when render to the same target twice', () => {
    let beforeRenderCount = 0;
    let afterRenderCount = 0;
    let container = createNodeElement('container');
    Host.driver = Object.assign({}, Host.driver, {
      beforeRender() {
        beforeRenderCount += 1;
      },
      afterRender() {
        afterRenderCount += 1;
      },
    });

    render(<div />, container);
    render(<span />, container);

    expect(beforeRenderCount).toBe(2);
    expect(afterRenderCount).toBe(2);
  });

  it('should not throw error when have callback and options is null', function(done) {
    let container = createNodeElement('container');
    render(<div />, container, function() {
      done();
    });
  });

  it('should not re-render when element is same in same root', function() {
    let container = createNodeElement('container');
    let updatedCount = 0;
    let App = function() {
      updatedCount++;
      return <div />;
    };
    let CacheApp = <App />;

    render(CacheApp, container);
    expect(container.childNodes[0].tagName).toBe('DIV');
    expect(updatedCount).toBe(1);
    render(CacheApp, container);
    expect(container.childNodes[0].tagName).toBe('DIV');
    expect(updatedCount).toBe(1);
  });

  it('render in the life cycle should in a batch', function() {
    let container = createNodeElement('div');
    let container2 = createNodeElement('div');

    const Child = jest.fn(function(props) {
      return <span>{props.number}</span>;
    });

    class App extends Component {
      componentDidMount() {
        render(<Child number="1" />, container2);
        render(<Child number="2" />, container2);
        render(<Child number="3" />, container2);
        render(<Child number="4" />, container2);
        expect(container2.childNodes).toEqual([]);
      }
      render() {
        return <span />;
      }
    }
    render(<App />, container);
    jest.runAllTimers();
    expect(Child).toHaveBeenCalledTimes(1);
    expect(container2.childNodes[0].childNodes[0].data).toBe('4');
  });
});
