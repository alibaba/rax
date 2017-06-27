'use strict';
/* @jsx createElement */

import Component from '../../component';
import PropTypes from '../../proptypes';
import {createElement} from '../../element';
import Host from '../host';
import render from '../../render';
import ServerDriver from 'driver-server';
import findDOMNode from '../../findDOMNode';
import renderToString from '../../server/renderToString';

describe('Context', function() {
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

  it('should pass context when rendering subtree elsewhere', function() {
    class MyComponent extends Component {
      static contextTypes = {
        foo: PropTypes.string.isRequired,
      };

      render() {
        return <div>{this.context.foo}</div>;
      }
    }

    class Parent extends Component {
      static childContextTypes = {
        foo: PropTypes.string.isRequired,
      };

      getChildContext() {
        return {
          foo: 'bar',
        };
      }

      render() {
        return <MyComponent />;
      }
    }

    let html = renderToString(<Parent />);
    expect(html).toBe('<div data-rendered="server">bar</div>');
  });


  it('should filter out context not in contextTypes', function() {
    class MyComponent extends Component {
      static contextTypes = {
        foo: PropTypes.string,
      };

      render() {
        return <div />;
      }
    }

    class ComponentInFooBarContext extends Component {
      static childContextTypes = {
        foo: PropTypes.string,
        bar: PropTypes.number,
      };

      getChildContext() {
        return {
          foo: 'abc',
          bar: 123,
        };
      }

      render() {
        return <MyComponent />;
      }
    }

    let instance = render(<ComponentInFooBarContext />);
    expect(instance._internal._renderedComponent._instance.context).toEqual({foo: 'abc'});
  });

  it('should update context if it changes due to setState', function() {
    var container = createNodeElement('div');

    class MyComponent extends Component {
      static contextTypes = {
        foo: PropTypes.string.isRequired,
        getFoo: PropTypes.func.isRequired,
      };

      render() {
        return <div>{this.context.foo + '-' + this.context.getFoo()}</div>;
      }
    }

    class Parent extends Component {
      static childContextTypes = {
        foo: PropTypes.string.isRequired,
        getFoo: PropTypes.func.isRequired,
      };

      state = {
        bar: 'initial',
      };

      getChildContext() {
        return {
          foo: this.state.bar,
          getFoo: () => this.state.bar,
        };
      }

      render() {
        return <MyComponent />;
      }
    }

    var instance = render(<Parent />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('initial-initial');
    instance.setState({bar: 'changed'});
    expect(container.childNodes[0].childNodes[0].data).toBe('changed-changed');
  });
});
