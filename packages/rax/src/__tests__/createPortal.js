/* @jsx createElement */

import findDOMNode from '../findDOMNode';
import Component from '../component';
import PropTypes from '../proptypes';
import {createElement} from '../element';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import createPortal from '../createPortal';
import unmountComponentAtNode from '../unmountComponentAtNode';

describe('createPortal', () => {
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

  it('should render one portal', () => {
    const container = createNodeElement('div');
    const portalContainer = createNodeElement('div');

    render(
      <div>{createPortal(<div>portal</div>, portalContainer)}</div>,
      container
    );

    expect(container.childNodes[0].tagName).toBe('DIV');
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('portal');

    unmountComponentAtNode(container);

    expect(container.childNodes.length).toBe(0);
    expect(portalContainer.childNodes.length).toBe(0);
  });


  it('should pass portal context when rendering subtree elsewhere', function() {
    const container = createNodeElement('div');
    const portalContainer = createNodeElement('div');

    class Sub extends Component {
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
        return createPortal(<Sub />, portalContainer);
      }
    }

    render(<Parent />, container);
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('bar');
  });

  it('should update portal context if it changes due to re-render', () => {
    const container = createNodeElement('div');
    const portalContainer = createNodeElement('div');

    class Sub extends Component {
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

      getChildContext() {
        return {
          foo: this.props.bar,
          getFoo: () => this.props.bar,
        };
      }

      render() {
        return createPortal(<Sub />, portalContainer);
      }
    }

    render(<Parent bar="initial" />, container);
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('initial-initial');

    render(<Parent bar="changed" />, container);
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('changed-changed');
  });
});
