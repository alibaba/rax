/* @jsx createElement */

import Component from '../../component';
import createElement from '../../createElement';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';
import findDOMNode from '../../findDOMNode';
import unmountComponentAtNode from '../../unmountComponentAtNode';

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
  });

  afterEach(function() {
    Host.driver = null;
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
    expect(findDOMNode(component.refs.x).tagName).toBe('A');

    component.toggleActivatedState();
    expect(findDOMNode(component.refs.x).tagName).toBe('B');
  });


  it('should cleanup even if render() fatals', function() {
    class BadComponent extends Component {
      render() {
        throw new Error();
      }
    }

    expect(Host.component).toBe(null);

    expect(function() {
      render(<BadComponent />);
    }).not.toThrow();

    expect(Host.component).toBe(null);
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

  it('setState callback triggered in componentWillMount', function() {
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
      render() {
        return <span className={this.state.value} />;
      }
    }

    render(<Foo />, container);
    expect(triggered).toBe(true);
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

    render(<Foo value="foo" />, container);
    expect(lifeCycles).toEqual([
      'will-mount',
      'render',
      'did-mount'
    ]);
    lifeCycles = []; // reset
    render(<Foo value="bar" />, container);
    expect(lifeCycles).toEqual([
      'receive-props', {value: 'bar'},
      'should-update', {value: 'bar'}, {value: 'bar'},
      'will-update', {value: 'bar'}, {value: 'bar'},
      'render',
      'did-update', {value: 'foo'}, {value: 'foo'},
      'receive-props-callback'
    ]);
    lifeCycles = []; // reset
    unmountComponentAtNode(container);
    expect(lifeCycles).toEqual([
      'will-unmount',
    ]);
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

    expect(container.childNodes[0].childNodes[0].data).toBe('Caught an error: Hello.');
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

    render(
      <ErrorBoundary />, container);
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
          <span>siblings</span>,
          <BrokenRender />,
          <span>siblings</span>
        ];
      }
    }

    function BrokenRender() {
      throw new Error('Hello');
    }

    render(
      <ErrorBoundary />, container);
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
        return null;
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

    expect(logs).toEqual([
      'componentWillMount1',
      'render1',
      'componentDidMount1',
      'componentWillMount2',
      'render2',
      'componentDidMount2',
      'componentWillMount3',
      'render3',
      'componentDidMount3',
      'componentDidMountErrorBoundary',
      'componentWillUnmount1',
      'componentWillUnmount2',
      'componentWillUnmount3',
      'componentDidUpdateErrorBoundary'
    ]);
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
    expect(container.childNodes[0].tagName).toBe('DIV');
  });
});
