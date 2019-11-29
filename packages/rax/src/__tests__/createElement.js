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
    jest.runAllTimers();
  }

  beforeEach(function() {
    Host.driver = ServerDriver;
    jest.useFakeTimers();
  });

  afterEach(function() {
    Host.driver = null;
    jest.useRealTimers();
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
    }).toThrowError(/Invalid element type/);

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

    expect(() => renderToDocument(<ComponentWrapper />)).toWarnDev(
      'Each child in a list should have a unique "key" prop. Check the render method of <InnerComponent>. It was passed a child from <ComponentWrapper>.',
      {withoutStack: true}
    );
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

  it('throws for the child array contains invalid element type', () => {
    expect(() => {
      let container = createNodeElement('div');
      render(<div>{[{}]}</div>, container);
      jest.runAllTimers();
    }).toThrowError(
      'Invalid child type, expected types: Element instance, string, boolean, array, null, undefined. (found: object with keys {})'
    );

    expect(() => {
      let container = createNodeElement('div');
      render(<div>{[{foo: 1}]}</div>, container);
      jest.runAllTimers();
    }).toThrowError(
      'Invalid child type, expected types: Element instance, string, boolean, array, null, undefined. (found: object with keys {foo})'
    );
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

  it('throw errors in dev mode when modify props', () => {
    let container = createNodeElement('div');
    function Foo(props) {
      props.foo = 'bar';
      return null;
    }

    expect(() => {
      render(<Foo foo="foo" />, container);
      jest.runAllTimers();
    }).toThrowError(/Cannot assign to read only property/);
  });

  it('make children output correct when components use the same props object', () => {
    let thisProps = {};
    let tagA = <div {...thisProps}>A</div>;
    let tagB = <div {...thisProps} a={1}>B</div>;
    let tagC = <div {...thisProps}>C</div>;
    expect(tagA.props.children).toBe('A');
    expect(tagB.props.children).toBe('B');
    expect(tagC.props.children).toBe('C');
  });
});
