'use strict';
/* @jsx createElement */

import Component from '../component';
import PropTypes from 'prop-types';
import createElement from '../../createElement';
import Host from '../host';
import ServerDriver from 'driver-server';
import render from '../../render';

function StatelessComponent(props) {
  return <div>{props.name}</div>;
}

describe('ReactiveComponent', function() {
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

  it('should render functional stateless component', function() {
    let container = createNodeElement('div');
    render(<StatelessComponent name="A" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('A');
  });

  it('should render class stateless component', function() {
    let container = createNodeElement('div');

    class MyComponent {
      render() {
        return <StatelessComponent {...this.props} />;
      }
    }

    render(<MyComponent name="A" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('A');
  });

  it('should update stateless component', function() {
    let container = createNodeElement('div');

    class Parent extends Component {
      render() {
        return <StatelessComponent {...this.props} />;
      }
    }

    render(<Parent name="A" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('A');

    render(<Parent name="B" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('B');
  });

  it('should pass context thru stateless component', function() {
    let container = createNodeElement('div');

    class Child extends Component {
      static contextTypes = {
        test: PropTypes.string.isRequired,
      };

      render() {
        return <div>{this.context.test}</div>;
      }
    }

    function Parent() {
      return <Child />;
    }

    class GrandParent extends Component {
      static childContextTypes = {
        test: PropTypes.string.isRequired,
      };

      getChildContext() {
        return {test: this.props.test};
      }

      render() {
        return <Parent />;
      }
    }

    render(<GrandParent test="foo" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('foo');

    render(<GrandParent test="bar" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('bar');
  });


  it('should support default props and prop types', function() {
    let container = createNodeElement('div');

    function Child(props) {
      return <div>{props.test}</div>;
    }
    Child.defaultProps = {test: 'test'};
    Child.propTypes = {test: PropTypes.string};

    render(<Child test="foo" />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('foo');
  });

  it('should receive context', function() {
    let container = createNodeElement('div');

    class Parent extends Component {
      static childContextTypes = {
        lang: PropTypes.string,
      };

      getChildContext() {
        return {lang: 'en'};
      }

      render() {
        return <Child />;
      }
    }

    function Child(props, context) {
      return <div>{context.lang}</div>;
    }

    Child.contextTypes = {lang: PropTypes.string};

    render(<Parent />, container);
    expect(container.childNodes[0].childNodes[0].data).toBe('en');
  });

  it('should allow simple functions to return null', function() {
    let container = createNodeElement('div');

    function Child() {
      return null;
    };

    render(<Child />, container);
    expect(container.childNodes[0].nodeType).toBe(8);
  });

  it('should allow simple functions to return false', function() {
    let container = createNodeElement('div');
    function Child() {
      return false;
    }

    render(<Child />, container);
    expect(container.childNodes[0].nodeType).toBe(8);
  });
});