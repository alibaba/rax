/* @jsx createElement */

import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import Component from '../vdom/component';

describe('Element', () => {
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

  function renderToDocument(element) {
    let container = createNodeElement('div');
    render(element, container);
  }

  beforeEach(function() {
    Host.driver = ServerDriver;
  });

  afterEach(function() {
    Host.driver = null;
  });

  it('createElement', () => {
    function Foo(props) {
      return <props.tag />;
    }
    let foo = <Foo tag="Foo" />;
    expect(foo.props.tag).toBe('Foo');
  });

  it('throws when passing null, undefined', function() {
    expect(function() {
      createElement(null);
    }).toThrow();

    expect(function() {
      createElement(undefined);
    }).toThrow();

    jest.useFakeTimers();

    expect(function() {
      class ParentComp {
        render() {
          return createElement(null);
        }
      }

      var component = render(<ParentComp />);

      jest.runAllTimers();
    }).toThrowError(
      'createElement: type should not be null or undefined. Check ' +
      'the render method of `ParentComp`.'
    );

    jest.useRealTimers();
  });

  it('warns for keys for arrays of elements in children position', () => {
    expect(() => renderToDocument(
      <div>{[<div />, <div />]}</div>
    )).toWarnDev('Each child in a list should have a unique "key" prop.', {withoutStack: true});
  });

  it('warns of keys for arrays of elements with owner info', () => {
    class InnerComponent extends Component {
      render() {
        return this.props.childSet;
      }
    }

    class ComponentWrapper extends Component {
      render() {
        return <InnerComponent childSet={[<div />, <div />]} />;
      }
    }

    expect(() => renderToDocument(<ComponentWrapper />)).toWarnDev('Warning: Each child in a list should have a unique "key" prop. Check the render method of `InnerComponent`. It was passed a child from ComponentWrapper.', {withoutStack: true});
  });

  it('does not warn for arrays of elements with keys', () => {
    renderToDocument((
      <div>
        {[
          <span key={'#1'}>1</span>,
          <span key={'#2'}>2</span>
        ]}
      </div>
    ));
  });

  it('does not warn when element is directly as children', () => {
    renderToDocument((
      <div>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </div>
    ));
  });

  it('does not warn when the child array contains non-element', () => {
    void <div>{[{}, {}]}</div>;
  });

  it('warns for fragments of multiple elements with same key', () => {
    expect(() => renderToDocument((
      <div>
        <span key={'#1'}>1</span>
        <span key={'#1'}>2</span>
        <span key={'#2'}>3</span>
      </div>
    ))).toWarnDev('Warning: Encountered two children with the same key "#1".', {withoutStack: true});
  });
});
