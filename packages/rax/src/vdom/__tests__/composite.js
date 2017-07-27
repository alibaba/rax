/* @jsx createElement */

import Component from '../../component';
import {createElement} from '../../element';
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
});
