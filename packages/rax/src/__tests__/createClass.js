/* @jsx createElement */
/* eslint react/prefer-es6-class: "off" */

import {createElement} from '../element';
import PropTypes from '../proptypes';
import createClass from '../createClass';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import findDOMNode from '../findDOMNode';

describe('createClass', () => {
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

  it('should copy `displayName` onto the Constructor', function() {
    var TestComponent = createClass({
      displayName: 'TestComponent',
      render: function() {
        return <div />;
      }
    });

    expect(TestComponent.displayName).toBe('TestComponent');
  });

  it('should support statics', function() {
    var Component = createClass({
      statics: {
        abc: 'def',
        def: 0,
        ghi: null,
        jkl: 'mno',
        pqr: function() {
          return this;
        },
      },

      render: function() {
        return <span />;
      },
    });

    var instance = render(<Component />);
    expect(instance.constructor.abc).toBe('def');
    expect(Component.abc).toBe('def');
    expect(instance.constructor.def).toBe(0);
    expect(Component.def).toBe(0);
    expect(instance.constructor.ghi).toBe(null);
    expect(Component.ghi).toBe(null);
    expect(instance.constructor.jkl).toBe('mno');
    expect(Component.jkl).toBe('mno');
    expect(instance.constructor.pqr()).toBe(Component);
    expect(Component.pqr()).toBe(Component);
  });

  it('should work with object getInitialState() return values', function() {
    var Component = createClass({
      getInitialState: function() {
        return {
          occupation: 'clown',
        };
      },
      render: function() {
        return <span />;
      },
    });

    var instance = render(<Component />);
    expect(instance.state.occupation).toEqual('clown');
  });

  it('renders based on context getInitialState', function() {
    var Foo = createClass({
      contextTypes: {
        className: PropTypes.string,
      },
      getInitialState() {
        return {className: this.context.className};
      },
      render() {
        return <span className={this.state.className} />;
      },
    });

    var Outer = createClass({
      childContextTypes: {
        className: PropTypes.string,
      },
      getChildContext() {
        return {className: 'foo'};
      },
      render() {
        return <Foo />;
      },
    });

    var container = createNodeElement('div');
    render(<Outer />, container);
    expect(container.childNodes[0].attributes.class).toBe('foo');
  });

  it('should support statics in mixins', function() {
    var Mixin = {
      statics: {
        foo: 'bar',
      },
    };
    var Component = createClass({
      mixins: [Mixin],

      statics: {
        abc: 'def',
      },

      render: function() {
        return <span />;
      },
    });

    var container = createNodeElement('div');
    var instance = render(<Component />, container);

    expect(instance.constructor.foo).toBe('bar');
    expect(Component.foo).toBe('bar');
    expect(instance.constructor.abc).toBe('def');
    expect(Component.abc).toBe('def');
  });

  it('should include the mixin keys in even if their values are falsy', function() {
    var mixin = {
      keyWithNullValue: null,
      randomCounter: 0,
    };

    var Component = createClass({
      mixins: [mixin],
      componentDidMount: function() {
        expect(this.randomCounter).toBe(0);
        expect(this.keyWithNullValue).toBeNull();
      },
      render: function() {
        return <span />;
      },
    });

    render(<Component />, createNodeElement('div'));
  });

  it('should work with a null getInitialState return value and a mixin', () => {
    var Component;
    var instance;

    var Mixin = {
      getInitialState: function() {
        return {foo: 'bar'};
      },
    };
    Component = createClass({
      mixins: [Mixin],
      getInitialState: function() {
        return null;
      },
      render: function() {
        return <span />;
      },
    });

    instance = render(<Component />, createNodeElement('div'));
    expect(instance.state).toEqual({foo: 'bar'});

    // Also the other way round should work
    var Mixin2 = {
      getInitialState: function() {
        return null;
      },
    };
    Component = createClass({
      mixins: [Mixin2],
      getInitialState: function() {
        return {foo: 'bar'};
      },
      render: function() {
        return <span />;
      },
    });

    instance = render(<Component />, createNodeElement('div'));
    expect(instance.state).toEqual({foo: 'bar'});

    // Multiple mixins should be fine too
    Component = createClass({
      mixins: [Mixin, Mixin2],
      getInitialState: function() {
        return {x: true};
      },
      render: function() {
        return <span />;
      },
    });

    instance = render(<Component />, createNodeElement('div'));
    expect(instance.state).toEqual({foo: 'bar', x: true});
  });

  it('should have bound the mixin methods to the component', function() {
    var mixin = {
      mixinFunc: function() {
        return this;
      },
    };

    var Component = createClass({
      mixins: [mixin],
      componentDidMount: function() {
        expect(this.mixinFunc()).toBe(this);
      },
      render: function() {
        return <span />;
      },
    });

    render(<Component />, createNodeElement('div'));
  });

  it('should support mixins with getInitialState()', function() {
    var Mixin = {
      getInitialState: function() {
        return {mixin: true};
      },
    };
    var Component = createClass({
      mixins: [Mixin],
      getInitialState: function() {
        return {component: true};
      },
      render: function() {
        return <span />;
      },
    });
    var instance = render(<Component />, createNodeElement('div'));
    expect(instance.state.component).toBe(true);
    expect(instance.state.mixin).toBe(true);
  });

  it('should support merging propTypes and statics', function() {
    var MixinA = {
      propTypes: {
        propA: function() {},
      },
      componentDidMount: function() {
        this.props.listener('MixinA didMount');
      },
    };

    var MixinB = {
      mixins: [MixinA],
      propTypes: {
        propB: function() {},
      },
      componentDidMount: function() {
        this.props.listener('MixinB didMount');
      },
    };

    var MixinC = {
      statics: {
        staticC: function() {},
      },
      componentDidMount: function() {
        this.props.listener('MixinC didMount');
      },
    };

    var MixinD = {
      propTypes: {
        value: PropTypes.string,
      },
    };

    var Component = createClass({
      mixins: [MixinB, MixinC, MixinD],
      statics: {
        staticComponent: function() {},
      },
      propTypes: {
        propComponent: function() {},
      },
      componentDidMount: function() {
        this.props.listener('Component didMount');
      },
      render: function() {
        return <div />;
      },
    });

    var listener = function() {};
    var instance = render(<Component listener={listener} />, createNodeElement('div'));
    var instancePropTypes = instance.constructor.propTypes;

    expect('propA' in instancePropTypes).toBe(true);
    expect('propB' in instancePropTypes).toBe(true);
    expect('propComponent' in instancePropTypes).toBe(true);

    expect('staticC' in Component).toBe(true);
    expect('staticComponent' in Component).toBe(true);
  });
});
