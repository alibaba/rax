/* @jsx createElement */

import Component from '../component';
import createElement from '../../createElement';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';

describe('CompositeComponent', function() {
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

  it('should rewire refs when rendering to different child types', function() {
    class MyComponent extends Component {
      state = {activated: false};

      toggleActivatedState = () => {
        this.setState({activated: !this.state.activated});
      };

      render() {
        return !this.state.activated ?
          <a ref="x" /> :
          <b ref="x" />;
      }
    }

    let component = render(<MyComponent />);
    expect(component.refs.x.tagName).toBe('A');

    component.toggleActivatedState();

    jest.runAllTimers();
    expect(component.refs.x.tagName).toBe('B');
  });

  it('donot call render when setState in componentWillMount', function() {
    let container = createNodeElement('div');
    let renderCounter = 0;
    class Foo extends Component {
      constructor() {
        super();
        this.state = {};
      }
      componentWillMount() {
        this.setState({
          value: 'foo'
        });
      }
      render() {
        ++renderCounter;
        return <span className={this.state.value} />;
      }
    }

    render(<Foo />, container);
    expect(renderCounter).toEqual(1);
    expect(container.childNodes[0].attributes.class).toBe('foo');
  });

  it('setState callback triggered', function() {
    let container = createNodeElement('div');
    let triggered = false;
    class Foo extends Component {
      constructor() {
        super();
        this.state = {};
      }
      componentWillMount() {
        this.setState({
          value: 'foo'
        }, () => {
          triggered = true;
        });
      }
      componentWillReceiveProps() {
        this.setState({
          value: 'foo'
        }, () => {
          triggered = true;
        });
      }
      render() {
        return <span className={this.state.value} />;
      }
    }

    const instance = render(<Foo />, container);
    expect(triggered).toBe(true);
    triggered = false;
    instance.setState({}, () => triggered = true);
    jest.runAllTimers();
    expect(triggered).toBe(true);
    triggered = false;
    render(<Foo />, container);
    expect(triggered).toBe(true);
  });


  it('setState callback triggered in didMount or didUpdate should receive latest state', function() {
    let container = createNodeElement('div');
    const logs = [];
    class Foo extends Component {
      constructor() {
        super();
        this.state = {
          count: 1
        };
      }
      componentDidMount() {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({
          count: 2
        }, () => {
          logs.push(this.state.count);
        });
      }
      componentDidUpdate() {
        if (this.state.count === 2) {
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({
            count: 3
          }, () => {
            logs.push(this.state.count);
          });
        };
      }
      render() {
        return <span className={this.state.value} />;
      }
    }

    render(<Foo />, container);
    jest.runAllTimers();
    expect(logs).toEqual([2, 3]);
  });

  it('will call all the normal life cycle methods', function() {
    var lifeCycles = [];
    let container = createNodeElement('div');

    class Foo extends Component {
      constructor() {
        super();
        this.state = {};
      }
      componentWillMount() {
        this.setState({value: 'foo'});
        lifeCycles.push('will-mount');
      }
      componentDidMount() {
        lifeCycles.push('did-mount');
      }
      componentWillReceiveProps(nextProps) {
        this.setState({value: 'bar'}, function() {
          lifeCycles.push('receive-props-callback');
        });
        lifeCycles.push('receive-props', nextProps);
      }
      shouldComponentUpdate(nextProps, nextState) {
        lifeCycles.push('should-update', nextProps, nextState);
        return true;
      }
      componentWillUpdate(nextProps, nextState) {
        lifeCycles.push('will-update', nextProps, nextState);
      }
      componentDidUpdate(prevProps, prevState) {
        lifeCycles.push('did-update', prevProps, prevState);
      }
      componentWillUnmount() {
        lifeCycles.push('will-unmount');
      }
      render() {
        lifeCycles.push('render');
        return <span className={this.props.value} />;
      }
    }

    render(<div><Foo value="foo" /></div>, container);
    expect(lifeCycles).toEqual([
      'will-mount',
      'render',
      'did-mount'
    ]);
    lifeCycles = []; // reset
    render(<div><Foo value="bar" /></div>, container);
    expect(lifeCycles).toEqual([
      'receive-props', {value: 'bar'},
      'should-update', {value: 'bar'}, {value: 'bar'},
      'will-update', {value: 'bar'}, {value: 'bar'},
      'render',
      'did-update', {value: 'foo'}, {value: 'foo'},
      'receive-props-callback'
    ]);
    lifeCycles = []; // reset
    render(<div />, container);
    expect(lifeCycles).toEqual([
      'will-unmount',
    ]);
  });

  it('not break other component render when one component rise an error', () => {
    let container = createNodeElement('div');
    class MyComponent extends Component {
      render() {
        return [
          <BrokenRender key="a" />,
          <NoBrokenRender key="b" />
        ];
      }
    }

    class BrokenRender extends Component {
      constructor() {
        throw new Error('Hello');
      }
      render() {
        return (
          <span>Hello 1</span>
        );
      }
    }

    class NoBrokenRender extends Component {
      render() {
        return (
          <span>Hello 2</span>
        );
      }
    }

    expect(() => {
      render(<MyComponent />, container);
      jest.runAllTimers();
    }).toThrowError(/Hello/);

    expect(container.childNodes[0].childNodes[0].data).toBe('Hello 2');
  });

  it('catches render error in a boundary', () => {
    let container = createNodeElement('div');
    class ErrorBoundary extends Component {
      state = {error: null};
      componentDidCatch(error) {
        this.setState({error});
      }
      render() {
        if (this.state.error) {
          return (
            <span>{`Caught an error: ${this.state.error.message}.`}</span>
          );
        }
        return this.props.children;
      }
    }

    function BrokenRender(props) {
      throw new Error('Hello');
    }

    render(
      <ErrorBoundary>
        <BrokenRender />
      </ErrorBoundary>, container);

    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('Caught an error: Hello.');
  });

  it('catches component update error in a boundary', () => {
    let container = createNodeElement('div');
    class ErrorBoundary extends Component {
      state = {error: null};
      componentDidCatch(error) {
        this.setState({error});
      }
      render() {
        if (this.state.error) {
          return (
            <span>{`Caught an error: ${this.state.error.message}.`}</span>
          );
        }
        return this.props.children;
      }
    }

    class BrokenRender extends Component {
      state = {foo: 'Hello'};
      componentDidMount() {
        setTimeout(() => {
          this.setState({
            foo: 'error'
          });
        });
      }
      render() {
        if (this.state.foo === 'error') {
          throw Error('foo');
        }
        return (
          <span>{this.state.foo}</span>
        );
      }
    }

    render(
      <ErrorBoundary>
        <BrokenRender />
      </ErrorBoundary>, container);

    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toContain('Caught an error: foo');
  });

  it('catches lifeCycles errors in a boundary', () => {
    let container = createNodeElement('div');
    class ErrorBoundary extends Component {
      state = {error: null};
      componentDidCatch(error) {
        this.setState({error});
      }
      render() {
        if (this.state.error) {
          return (
            <span>{`Caught an error: ${this.state.error.message}.`}</span>
          );
        }
        return this.props.children;
      }
    }

    class BrokenRender extends Component {
      componentDidMount() {
        throw new Error('Hello');
      }
      render() {
        return (
          <span>Hello</span>
        );
      }
    }

    render(
      <ErrorBoundary>
        <BrokenRender />
      </ErrorBoundary>, container);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('Caught an error: Hello.');
  });

  it('catches constructor errors in a boundary', () => {
    let container = createNodeElement('div');
    class ErrorBoundary extends Component {
      state = {error: null};
      componentDidCatch(error) {
        this.setState({error});
      }
      render() {
        if (this.state.error) {
          return (
            <span>{`Caught an error: ${this.state.error.message}.`}</span>
          );
        }
        return this.props.children;
      }
    }

    class BrokenRender extends Component {
      constructor() {
        throw new Error('Hello');
      }
      render() {
        return (
          <span>Hello</span>
        );
      }
    }

    render(
      <ErrorBoundary>
        <BrokenRender />
      </ErrorBoundary>, container);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('Caught an error: Hello.');
  });

  it('catches render errors in a component', () => {
    let container = createNodeElement('div');
    class BrokenRender extends Component {
      state = {error: null};
      componentDidCatch(error) {
        this.setState({error});
      }
      render() {
        if (this.state.error) {
          return (
            <span>{`Caught an error: ${this.state.error.message}.`}</span>
          );
        }
        throw new Error('Hello');
      }
    }

    render(<BrokenRender />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('Caught an error: Hello.');
  });

  it('should not attempt to recover an unmounting error boundary', () => {
    let container = createNodeElement('div');
    let logs = [];
    class Parent extends Component {
      componentWillUnmount() {
        logs.push('Parent componentWillUnmount');
      }
      render() {
        return <Boundary />;
      }
    }

    class Boundary extends Component {
      componentDidCatch(e) {
        logs.push(`Caught error: ${e.message}`);
      }
      render() {
        return <ThrowsOnUnmount />;
      }
    }

    class ThrowsOnUnmount extends Component {
      componentWillUnmount() {
        logs.push('ThrowsOnUnmount componentWillUnmount');
        throw new Error('unmount error');
      }
      render() {
        return null;
      }
    }

    render(<Parent />, container);
    render(<div />, container);
    expect(logs).toEqual([
      // Parent unmounts before the error is thrown.
      'Parent componentWillUnmount',
      'ThrowsOnUnmount componentWillUnmount',
    ]);
  });

  it('rendering correct on siblings of a component that throws', () => {
    let container = createNodeElement('div');
    function BrokenRender() {
      throw new Error('Hello');
    }
    class ErrorBoundary extends Component {
      state = {error: null};
      componentDidCatch(error) {
        this.setState({error});
      }
      render() {
        if (this.state.error) {
          return (
            <div>{`Caught an error: ${this.state.error.message}.`}</div>
          );
        }
        return (
          <div>
            <span>siblings</span>
            <BrokenRender />
            <span>siblings</span>
          </div>
        );
      }
    }

    render(<ErrorBoundary />, container);
    jest.runAllTimers();
    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].childNodes[0].data).toBe('Caught an error: Hello.');
  });

  it('working correct with fragment when a component that throw error', () => {
    let container = createNodeElement('div');
    class ErrorBoundary extends Component {
      state = {error: null};
      componentDidCatch(error) {
        this.setState({error});
      }
      render() {
        if (this.state.error) {
          return (
            <span>{`Caught an error: ${this.state.error.message}.`}</span>
          );
        }
        return [
          <span key={'1'}>siblings</span>,
          <BrokenRender key={'error'} />,
          <span key={'2'}>siblings</span>
        ];
      }
    }

    function BrokenRender() {
      throw new Error('Hello');
    }

    render(<ErrorBoundary />, container);
    jest.runAllTimers();
    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].childNodes[0].data).toBe('Caught an error: Hello.');
  });

  it('Life cycle method invocation sequence should be correct', () => {
    let logs = [];

    let container = createNodeElement('div');
    class ErrorBoundary extends Component {
      state = {error: null};
      componentDidCatch(error) {
        this.setState({error});
      }
      componentDidMount() {
        logs.push('componentDidMountErrorBoundary');
      }
      componentDidUpdate() {
        logs.push('componentDidUpdateErrorBoundary');
      }
      render() {
        if (this.state.error) {
          return (
            <span>{`Caught an error: ${this.state.error.message}.`}</span>
          );
        }
        return this.props.children;
      }
    }

    class Life1 extends Component {
      componentWillMount() {
        logs.push('componentWillMount1');
      }
      render() {
        logs.push('render1');
        return null;
      }
      componentDidMount() {
        logs.push('componentDidMount1');
      }

      componentWillUpdate() {
        logs.push('componentWillUpdata1');
      }
      componentDidUpdate() {
        logs.push('componentDidUpdate1');
      }
      componentWillUnmount() {
        logs.push('componentWillUnmount1');
      }
    }

    class Life2 extends Component {
      componentWillMount() {
        logs.push('componentWillMount2');
      }
      render() {
        logs.push('render2');
        throw new Error();
      }
      componentDidMount() {
        logs.push('componentDidMount2');
      }
      componentWillUpdate() {
        logs.push('componentWillUpdate2');
      }
      componentDidUpdate() {
        logs.push('componentDidUpdate2');
      }
      componentWillUnmount() {
        logs.push('componentWillUnmount2');
      }
    }

    class Life3 extends Component {
      componentWillMount() {
        logs.push('componentWillMount3');
      }
      render() {
        logs.push('render3');
        return null;
      }
      componentDidMount() {
        logs.push('componentDidMount3');
      }
      componentWillUpdata() {
        logs.push('componentWillUpdata3');
      }
      componentDidUpdate() {
        logs.push('componentDidUpdate3');
      }
      componentWillUnmount() {
        logs.push('componentWillUnmount3');
      }
    }

    render(
      <ErrorBoundary>
        <Life1 />
        <Life2 />
        <Life3 />
      </ErrorBoundary>, container);

    jest.runAllTimers();
    expect(logs).toEqual([
      'componentWillMount1',
      'render1',
      'componentWillMount2',
      'render2',
      'componentWillMount3',
      'render3',
      'componentDidMount1',
      'componentDidMount2',
      'componentDidMount3',
      'componentDidMountErrorBoundary',
      'componentWillUnmount1',
      'componentWillUnmount2',
      'componentWillUnmount3',
      'componentDidUpdateErrorBoundary'
    ]);
  });

  it('should boundary exec componentDidCatch when child setState throw error', () => {
    let container = createNodeElement('div');
    let child;

    class Child extends Component {
      state = {
        count: 1
      }
      render() {
        child = this;
        if (this.state.count === 2) {
          throw new Error('Hello');
        }
        return (
          <span>Hello</span>
        );
      }
    }

    class ErrorBoundary extends Component {
      state = {error: null};
      componentDidCatch(error) {
        this.setState({error});
      }
      render() {
        if (this.state.error) {
          return (
            <div>{`Caught an error: ${this.state.error.message}.`}</div>
          );
        }
        return (
          <div>
            <Child />
          </div>
        );
      }
    }

    render(<ErrorBoundary><Child /></ErrorBoundary>, container);
    expect(container.childNodes[0].childNodes[0].childNodes[0].data).toBe('Hello');
    child.setState({count: 2});
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('Caught an error: Hello.');
  });

  it('should render correct when prevRenderedComponent did not generate nodes', () => {
    let container = createNodeElement('div');
    class Frag extends Component {
      render() {
        return [];
      }
    }
    class App extends Component {
      state = {count: 0};
      render() {
        if (this.state.count === 0) {
          return <Frag />;
        }
        return <div />;
      }
    }

    const instance = render(<App />, container);
    expect(container.childNodes.length).toBe(0);
    instance.setState({count: 1});
    jest.runAllTimers();
    expect(container.childNodes[0].tagName).toBe('DIV');
  });

  it('render component that componentDidMount could get mounted DOM', () => {
    let container = createNodeElement('div');
    class Child extends Component {
      componentDidMount() {
        expect(container.childNodes[0].childNodes[0].childNodes[0].tagName).toBe('DIV');
      }
      render() {
        return <div />;
      }
    }
    class App extends Component {
      render() {
        return <div><Child /></div>;
      }
    }

    const instance = render(<div><App /></div>, container);
    jest.runAllTimers();
    expect(container.childNodes[0].tagName).toBe('DIV');
  });

  it('render with fragment that componentDidMount could get mounted DOM', () => {
    let container = createNodeElement('div');
    class Child extends Component {
      componentDidMount() {
        expect(container.childNodes[0].tagName).toBe('DIV');
      }
      render() {
        return <div />;
      }
    }
    class App extends Component {
      render() {
        return [
          <Child key="1" />
        ];
      }
    }

    const instance = render(<App />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].tagName).toBe('DIV');
  });

  it('schedules sync updates when inside componentDidMount/Update', () => {
    let container = createNodeElement('div');
    let instance;
    let ops = [];

    class Foo extends Component {
      state = {tick: 0};

      componentDidMount() {
        ops.push('componentDidMount (before setState): ' + this.state.tick);
        this.setState({tick: 1}); // eslint-disable-line
        // We're in a batch. Update hasn't flushed yet.
        ops.push('componentDidMount (after setState): ' + this.state.tick);
      }

      componentDidUpdate() {
        ops.push('componentDidUpdate: ' + this.state.tick);
        if (this.state.tick === 2) {
          ops.push('componentDidUpdate (before setState): ' + this.state.tick);
          this.setState({tick: 3}); // eslint-disable-line
          ops.push('componentDidUpdate (after setState): ' + this.state.tick);
          // We're in a batch. Update hasn't flushed yet.
        }
      }

      render() {
        ops.push('render: ' + this.state.tick);
        instance = this;
        return <span prop={this.state.tick} />;
      }
    }

    render(<Foo />, container);

    jest.runAllTimers();
    expect(ops).toEqual([
      'render: 0',
      'componentDidMount (before setState): 0',
      'componentDidMount (after setState): 0',
      // If the setState inside componentDidMount were deferred, there would be
      // no more ops. Because it has Task priority, we get these ops, too:
      'render: 1',
      'componentDidUpdate: 1',
    ]);

    ops = [];
    instance.setState({tick: 2});
    jest.runAllTimers();
    expect(ops).toEqual([
      'render: 2',
      'componentDidUpdate: 2',
      'componentDidUpdate (before setState): 2',
      'componentDidUpdate (after setState): 2',
      // If the setState inside componentDidUpdate were deferred, there would be
      // no more ops. Because it has Task priority, we get these ops, too:
      'render: 3',
      'componentDidUpdate: 3',
    ]);
  });

  it('performs Task work in the callback', () => {
    let container = createNodeElement('div');
    class Foo extends Component {
      state = {step: 1};
      componentDidMount() {
        this.setState({step: 2}, () => { // eslint-disable-line
          this.setState({step: 3}, () => {
            this.setState({step: 4}, () => {
              this.setState({step: 5});
            });
          });
        });
      }
      render() {
        return <span>{this.state.step}</span>;
      }
    }
    render(<Foo />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].childNodes[0].data).toBe('5');
  });

  it('should batch child/parent state updates together', () => {
    let container = createNodeElement('div');
    let container2 = createNodeElement('div');

    var parentUpdateCount = 0;

    class Parent extends Component {
      state = {x: 0};

      componentDidUpdate() {
        parentUpdateCount++;
      }

      render() {
        return <div><Child ref="child" x={this.state.x} /><Child2 ref="child2" x={this.state.x} /></div>;
      }
    }

    var childUpdateCount = 0;

    class Child extends Component {
      state = {y: 0};

      componentDidUpdate() {
        childUpdateCount++;
      }

      render() {
        return <div>{this.props.x + this.state.y}</div>;
      }
    }

    var child2UpdateCount = 0;

    class Child2 extends Component {
      state = {y: 0};

      componentDidUpdate() {
        child2UpdateCount++;
      }

      render() {
        return <div>{this.props.x + this.state.y}</div>;
      }
    }

    var instance = render(<Parent />, container);
    var child = instance.refs.child;
    var child2 = instance.refs.child2;
    expect(instance.state.x).toBe(0);
    expect(child.state.y).toBe(0);
    expect(child2.state.y).toBe(0);

    function Batch() {
      child.setState({y: 2});
      instance.setState({x: 1});
      child2.setState({y: 2});
      expect(instance.state.x).toBe(0);
      expect(child.state.y).toBe(0);
      expect(child2.state.y).toBe(0);
      expect(parentUpdateCount).toBe(0);
      expect(childUpdateCount).toBe(0);
      expect(child2UpdateCount).toBe(0);
      return null;
    }

    render(<Batch />, container2);
    jest.runAllTimers();
    expect(instance.state.x).toBe(1);
    expect(child.state.y).toBe(2);
    expect(child2.state.y).toBe(2);
    expect(parentUpdateCount).toBe(1);

    // Batching reduces the number of updates here to 1.
    expect(childUpdateCount).toBe(1);
    expect(child2UpdateCount).toBe(1);
  });

  it('does not call render after a component as been deleted', () => {
    let container = createNodeElement('div');
    let container2 = createNodeElement('div');
    var renderCount = 0;
    var componentB = null;

    class B extends Component {
      state = {updates: 0};

      componentDidMount() {
        componentB = this;
      }

      render() {
        renderCount++;
        return <div />;
      }
    }

    class A extends Component {
      state = {showB: true};

      render() {
        return this.state.showB ? <B /> : <div />;
      }
    }

    var component = render(<A />, container);
    function Batch() {
      // B will have scheduled an update but the batching should ensure that its
      // update never fires.
      componentB.setState({updates: 1});
      component.setState({showB: false});
    }

    render(<Batch />, container2);
    expect(renderCount).toBe(1);
  });

  it('does not update one component twice when schedule in the rendering phase', () => {
    let container = createNodeElement('div');
    let logs = [];

    class Child extends Component {
      state = {
        count: 0
      };
      componentDidUpdate() {
        logs.push(this.props.child);
      }
      componentDidMount() {
        this.setState({count: 1}); // eslint-disable-line
        this.setState({count: 2}); // eslint-disable-line
        this.setState({count: 3}); // eslint-disable-line
      }
      render() {
        return (
          [
            <span key={'1'}>{this.props.count}</span>,
            <span key={'2'}>{this.state.count}</span>
          ]
        );
      }
    }

    class Parent1 extends Component {
      state = {
        count: 0
      }
      componentDidUpdate() {
        logs.push('Parent1');
      }
      componentDidMount() {
        this.setState({count: 1}); // eslint-disable-line
        this.setState({count: 2}); // eslint-disable-line
      }
      render() {
        return <Child count={this.state.count} child="Child1" />;
      }
    }

    class Parent2 extends Component {
      state = {
        count: 0
      }
      shouldComponentUpdate() {
        return false;
      }
      componentDidUpdate() {
        logs.push('Parent2');
      }
      componentDidMount() {
        this.setState({count: 1}); // eslint-disable-line
        this.setState({count: 2}); // eslint-disable-line
      }
      render() {
        return <Child count={this.state.count} child="Child2" />;
      }
    }

    class App extends Component {
      render() {
        return [<Parent1 key={'a'} />, <Parent2 key={'b'} />];
      }
    }
    render(<App />, container);
    jest.runAllTimers();
    // Child1  Child2 appears only once
    expect(logs).toEqual(['Child1', 'Parent1', 'Child2']);
    expect(container.childNodes[0].childNodes[0].data).toBe('2');
    expect(container.childNodes[1].childNodes[0].data).toBe('3');
    expect(container.childNodes[2].childNodes[0].data).toBe('0');
    expect(container.childNodes[3].childNodes[0].data).toBe('3');
  });

  it('should update fragment to right position', function() {
    let el = createNodeElement('div');
    class Hello1 extends Component {
      render() {
        if (this.props.show) {
          return 'hello1';
        }
        return null;
      }
    }

    class Text extends Component {
      render() {
        return this.props.children;
      }
    }

    class Hello2 extends Component {
      render() {
        if (this.props.show) {
          return [<Text key="1">1</Text>, <Text key="2">2</Text>, <Text key="3">3</Text>];
        } else {
          return [<Text key="1">1</Text>, <Text key="2">2</Text>];
        }
      }
    }

    class MyComponent extends Component {
      state = {
        show: false
      }
      render() {
        return (
          <div>
            {'foo'}
            <Hello1 show={this.state.show} />
            <Hello2 show={this.state.show} />
          </div>
        );
      }
    }

    let inst = render(<MyComponent />, el);

    let container = el.childNodes[0];
    let childNodes = container.childNodes;
    expect(childNodes.length).toBe(4);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1].data).toBe(' empty ');
    expect(childNodes[2].data).toBe('1');
    expect(childNodes[3].data).toBe('2');

    inst.setState({
      show: true
    });
    jest.runAllTimers();

    childNodes = container.childNodes;

    expect(childNodes.length).toBe(5);
    expect(childNodes[0].data).toBe('foo');
    expect(childNodes[1].data).toBe('hello1');
    expect(childNodes[2].data).toBe('1');
    expect(childNodes[3].data).toBe('2');
    expect(childNodes[4].data).toBe('3');
  });

  it('unmount dirty component', function() {
    let el = createNodeElement('div');
    let childInstance1 = null;
    let childInstance2 = null;

    class Child1 extends Component {
      render() {
        childInstance1 = this;
        return <div>child1</div>;
      }
    }

    class Child2 extends Component {
      render() {
        childInstance2 = this;
        return <div>child2</div>;
      }
    }

    class App extends Component {
      componentWillReceiveProps() {
        childInstance1.forceUpdate();
        childInstance2.forceUpdate();
      }

      render() {
        if (this.props.empty) return null;
        return [<Child1 key="1" />, <Child2 key="2" />];
      }
    }
    render(<App />, el);
    expect(el.childNodes[0].childNodes[0].data).toBe('child1');
    expect(el.childNodes[1].childNodes[0].data).toBe('child2');
    render(<App empty />, el);
    jest.runAllTimers();
    expect(el.childNodes[0].nodeType).toEqual(8);
  });
});
