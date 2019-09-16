/* @jsx createElement */

'use strict';

import Component from '../component';
import createElement from '../../createElement';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';

describe('Key', function() {
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

  it('should unmount and remount if the key changes', function() {
    let container = createNodeElement('container');

    let mockMount = jest.fn();
    let mockUnmount = jest.fn();

    class MyComponent extends Component {
      componentDidMount = mockMount;
      componentWillUnmount = mockUnmount;
      render() {
        return <span>{this.props.text}</span>;
      }
    }

    expect(mockMount.mock.calls.length).toBe(0);
    expect(mockUnmount.mock.calls.length).toBe(0);

    render(<MyComponent text="orange" key="A" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('orange');
    expect(mockMount.mock.calls.length).toBe(1);
    expect(mockUnmount.mock.calls.length).toBe(0);

    // If we change the key, the component is unmounted and remounted
    render(<MyComponent text="green" key="B" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('green');
    expect(mockMount.mock.calls.length).toBe(2);
    expect(mockUnmount.mock.calls.length).toBe(1);

    // But if we don't change the key, the component instance is reused
    render(<MyComponent text="blue" key="B" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('blue');
    expect(mockMount.mock.calls.length).toBe(2);
    expect(mockUnmount.mock.calls.length).toBe(1);
  });

  it('should render right if the key is existed', function() {
    let container = createNodeElement('container');

    class Foo extends Component {
      state = {
        list: [<span key="0">0</span>, <span key="1">1</span>, <span key="2">2</span>]
      };

      render() {
        return <div>
          {this.state.list}
          {this.state.list[0]}
        </div>;
      }
    }

    expect(() => {
      render(<Foo value="foo" />, container);
      expect(container.childNodes[0].childNodes[0].childNodes[0].data).toBe('0');
      expect(container.childNodes[0].childNodes[1].childNodes[0].data).toBe('1');
      expect(container.childNodes[0].childNodes[2].childNodes[0].data).toBe('2');
      expect(container.childNodes[0].childNodes[3].childNodes[0].data).toBe('0');
    }).toWarnDev('Warning: Encountered two children with the same key "0".', {withoutStack: true});

    expect(() => {
      render(<Foo value="bar" />, container);
      expect(container.childNodes[0].childNodes[0].childNodes[0].data).toBe('0');
      expect(container.childNodes[0].childNodes[1].childNodes[0].data).toBe('1');
      expect(container.childNodes[0].childNodes[2].childNodes[0].data).toBe('2');
      expect(container.childNodes[0].childNodes[3].childNodes[0].data).toBe('0');
    }).toWarnDev('Warning: Encountered two children with the same key "0".', {withoutStack: true});
  });

  it('should render right if unshift new element', function() {
    let container = createNodeElement('container');

    class Foo extends Component {
      constructor(props) {
        super(props);
        this.state = {
          list: [<span key="0">0</span>, <span key="1">1</span>, <span key="2">2</span>]
        };
      }

      componentWillReceiveProps() {
        this.state.list.unshift(<span key="-1">-1</span>);
      }

      render() {
        return <div>
          {this.state.list}
        </div>;
      }
    }

    render(<Foo />, container);
    expect(container.childNodes[0].childNodes[0].childNodes[0].data).toBe('0');
    expect(container.childNodes[0].childNodes[1].childNodes[0].data).toBe('1');
    expect(container.childNodes[0].childNodes[2].childNodes[0].data).toBe('2');

    render(<Foo value="foo" />, container);
    expect(container.childNodes[0].childNodes[0].childNodes[0].data).toBe('-1');
    expect(container.childNodes[0].childNodes[1].childNodes[0].data).toBe('0');
    expect(container.childNodes[0].childNodes[2].childNodes[0].data).toBe('1');
    expect(container.childNodes[0].childNodes[3].childNodes[0].data).toBe('2');
  });

  it('should move to correct position for same key in different element', () => {
    let container = createNodeElement('container');
    class App extends Component {
      state = {count: 0};
      render() {
        return (
          <div>
            {
              this.state.count % 2 === 0 ? [<div key="a">1</div>, <span key="b">2</span>] :
                [<span key="b">2</span>, <span key="a">3</span>]
            }
          </div>
        );
      }
    }
    let instance = render(<App />, container);
    expect(container.childNodes[0].childNodes[0].childNodes[0].data).toBe('1');
    expect(container.childNodes[0].childNodes[1].childNodes[0].data).toBe('2');

    instance.setState({count: 1});
    jest.runAllTimers();

    expect(container.childNodes[0].childNodes[0].childNodes[0].data).toBe('2');
    expect(container.childNodes[0].childNodes[1].childNodes[0].data).toBe('3');
  });
});
