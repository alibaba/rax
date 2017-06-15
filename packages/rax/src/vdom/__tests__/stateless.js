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

function StatelessComponent(props) {
  return <div>{props.name}</div>;
}

describe('StatelessComponent', function() {
  beforeEach(function() {
    Host.driver = ServerDriver;
  });

  afterEach(function() {
    Host.driver = null;
  });

  it('should render functional stateless component', function() {
    let html = renderToString(<StatelessComponent name="A" />);
    expect(html).toBe('<div data-rendered="server">A</div>');
  });

  it('should render class stateless component', function() {
    class MyComponent {
      render() {
        return <StatelessComponent {...this.props} />;
      }
    }

    let html = renderToString(<MyComponent name="A" />);
    expect(html).toBe('<div data-rendered="server">A</div>');
  });

  it('should update stateless component', function() {
    class Parent extends Component {
      render() {
        return <StatelessComponent {...this.props} />;
      }
    }

    let html = renderToString(<Parent name="A" />);
    expect(html).toBe('<div data-rendered="server">A</div>');

    let html2 = renderToString(<Parent name="B" />);
    expect(html2).toBe('<div data-rendered="server">B</div>');
  });

  it('should pass context thru stateless component', function() {
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


    let html = renderToString(<GrandParent test="test" />);
    expect(html).toBe('<div data-rendered="server">test</div>');


    let html2 = renderToString(<GrandParent test="mest" />);
    expect(html2).toBe('<div data-rendered="server">mest</div>');
  });


  it('should support default props and prop types', function() {
    function Child(props) {
      return <div>{props.test}</div>;
    }
    Child.defaultProps = {test: 'test'};
    Child.propTypes = {test: PropTypes.string};

    let html = renderToString(<Child />);
    expect(html).toBe('<div data-rendered="server">test</div>');
  });

  it('should receive context', function() {
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

    let html = renderToString(<Parent />);
    expect(html).toBe('<div data-rendered="server">en</div>');
  });

  it('should allow simple functions to return null', function() {
    function Child() {
      return null;
    };
    let html = renderToString(<Child />);
    expect(html).toBe('<!-- empty -->');
  });

  it('should allow simple functions to return false', function() {
    function Child() {
      return false;
    }
    let html = renderToString(<Child />);
    expect(html).toBe('<!-- empty -->');
  });
});