/* @jsx createElement */

import PropTypes from 'rax-proptypes';
import { Component, createElement, render, shared } from 'rax';
import ServerDriver from 'driver-server';
import unmountComponentAtNode from 'rax-unmount-component-at-node';
import createPortal from '../';

const { Host } = shared;

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
    jest.useFakeTimers();
  });

  afterEach(function() {
    Host.driver = null;
    jest.useRealTimers();
  });

  it('should render one portal', () => {
    const container = createNodeElement('div');
    const portalContainer = createNodeElement('div');

    render(
      <div>{createPortal(<div>portal</div>, portalContainer)}</div>,
      container
    );

    jest.runAllTimers();
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

    jest.runAllTimers();
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
    jest.runAllTimers();
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('initial-initial');

    render(<Parent bar="changed" />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('changed-changed');
  });

  it('should update portal if context or element change', () => {
    const container = createNodeElement('div');
    const portalContainer = createNodeElement('div');
    let updatedCount = 0;

    class Sub extends Component {
      static contextTypes = {
        foo: PropTypes.string.isRequired,
      };

      render() {
        updatedCount++;
        return <div>{ this.context.foo || 'initial' }</div>;
      }
    }
    const CacheSub = <Sub />;

    class Parent extends Component {
      static childContextTypes = {
        foo: PropTypes.string.isRequired,
      };

      getChildContext() {
        if (!this.props.hasContext) return null;
        return {
          foo: this.props.bar,
        };
      }

      render() {
        return createPortal(this.props.newElement ? <Sub /> : CacheSub, portalContainer);
      }
    }

    render(<Parent />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('initial');
    expect(updatedCount).toBe(1);

    // nothing can be changed
    render(<Parent />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('initial');
    expect(updatedCount).toBe(1);

    // Context change
    render(<Parent bar="changed" hasContext={true} />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('changed');
    expect(updatedCount).toBe(2);

    // change context -> null
    render(<Parent />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('initial');
    expect(updatedCount).toBe(3);

    // nothing can be changed
    render(<Parent />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('initial');
    expect(updatedCount).toBe(3);

    // element change
    render(<Parent newElement={true} />, container);
    jest.runAllTimers();
    expect(container.childNodes[0].nodeType).toBe(8);
    expect(portalContainer.childNodes[0].childNodes[0].data).toBe('initial');
    expect(updatedCount).toBe(4);
  });
});
