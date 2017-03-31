/* eslint-disable react/no-did-mount-set-state */

import {createElement} from '../../element';
import Component from '../../component';
import renderer from '../renderer';

describe('renderer', () => {
  it('renders a simple component', () => {
    function Link() {
      return <a role="link" />;
    }

    var component = renderer.create(<Link />);
    expect(component.toJSON()).toEqual({
      tagName: 'A',
      attributes: { role: 'link' }
    });
  });

  it('renders a component', () => {
    class Link extends Component {
      render() {
        return (
          <a
            href={this.props.page || '#'}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}>
            {this.props.children}
          </a>
        );
      }
    }

    var noop = () => {};
    var component = renderer.create(<Link onMouseEnter={noop} page="http://example.com">Example</Link>);
    expect(component.toJSON()).toEqual({
      tagName: 'A',
      attributes: {
        href: 'http://example.com'
      },
      eventListeners: {
        mouseenter: noop
      },
      children: ['Example'],
    });
  });

  it('renders a top-level empty component', () => {
    function Empty() {
      return null;
    }
    var component = renderer.create(<Empty />);
    expect(component.toJSON()).toEqual(null);
  });

  it('renders some basics with an update', () => {
    var renders = 0;

    class MyComponent extends Component {
      state = {x: 3};

      render() {
        renders++;
        return (
          <div className="purple">
            {this.state.x}
            <Child />
            <Null />
          </div>
        );
      }

      componentDidMount() {
        this.setState({x: 7});
      }
    }

    var Child = () => {
      renders++;
      return <moo />;
    };

    var Null = () => {
      renders++;
      return null;
    };

    var component = renderer.create(<MyComponent />);
    expect(component.toJSON()).toEqual({
      tagName: 'DIV',
      attributes: { class: 'purple' },
      children: [
        '7',
        {
          tagName: 'MOO'
        },
      ],
    });
    expect(renders).toBe(6);
  });

  it('exposes the instance', () => {
    class Mouse extends Component {
      constructor() {
        super();
        this.state = {mouse: 'mouse'};
      }
      handleMoose() {
        this.setState({mouse: 'moose'});
      }
      render() {
        return <div>{this.state.mouse}</div>;
      }
    }
    var component = renderer.create(<Mouse />);

    expect(component.toJSON()).toEqual({
      tagName: 'DIV',
      children: ['mouse'],
    });

    var mouse = component.getInstance();
    mouse.handleMoose();
    expect(component.toJSON()).toEqual({
      tagName: 'DIV',
      children: ['moose'],
    });
  });

  it('updates types', () => {
    var component = renderer.create(<div>mouse</div>);
    expect(component.toJSON()).toEqual({
      tagName: 'DIV',
      children: ['mouse'],
    });

    component.update(<span>mice</span>);
    expect(component.toJSON()).toEqual({
      tagName: 'SPAN',
      children: ['mice'],
    });
  });

  it('does the full lifecycle', () => {
    var log = [];
    class Log extends Component {
      render() {
        log.push('render ' + this.props.name);
        return <div />;
      }
      componentDidMount() {
        log.push('mount ' + this.props.name);
      }
      componentWillUnmount() {
        log.push('unmount ' + this.props.name);
      }
    }

    var component = renderer.create(<Log key="foo" name="Foo" />);
    component.update(<Log key="bar" name="Bar" />);
    component.unmount();

    expect(log).toEqual([
      'render Foo',
      'mount Foo',
      'unmount Foo',
      'render Bar',
      'mount Bar',
      'unmount Bar',
    ]);
  });

  it('supports unmounting when using refs', () => {
    class Foo extends Component {
      render() {
        return <div ref="foo" />;
      }
    }
    const inst = renderer.create(
      <Foo />,
      {createNodeMock: () => 'foo'}
    );
    expect(() => inst.unmount()).not.toThrow();
  });
});
