/* @jsx createElement */

import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';
import forwardRef from '../forwardRef';
import createRef from '../createRef';
import memo from '../memo';

describe('forwardRef', () => {
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

  it('should update refs when switching between children', () => {
    const container = createNodeElement('div');

    function FunctionComponent({forwardedRef, setRefOnDiv}) {
      return (
        <section>
          <div ref={setRefOnDiv ? forwardedRef : null}>First</div>
          <span ref={setRefOnDiv ? null : forwardedRef}>Second</span>
        </section>
      );
    }

    const RefForwardingComponent = forwardRef((props, ref) => (
      <FunctionComponent {...props} forwardedRef={ref} />
    ));

    const ref = createRef();

    render(<RefForwardingComponent ref={ref} setRefOnDiv={true} />, container);
    expect(ref.current.tagName).toBe('DIV');

    render(<RefForwardingComponent ref={ref} setRefOnDiv={false} />, container);
    expect(ref.current.tagName).toBe('SPAN');
  });

  it('should support rendering null', () => {
    const container = createNodeElement('div');

    const RefForwardingComponent = forwardRef((props, ref) => null);

    const ref = createRef();

    render(<RefForwardingComponent ref={ref} />, container);

    expect(ref.current).toBe(null);
  });

  it('should support rendering null for multiple children', () => {
    const container = createNodeElement('div');

    const RefForwardingComponent = forwardRef((props, ref) => null);

    const ref = createRef();

    render(
      <div>
        <div />
        <RefForwardingComponent ref={ref} />
        <div />
      </div>,
      container
    );

    expect(ref.current).toBe(null);
  });

  it('should support defaultProps', () => {
    const container = createNodeElement('div');

    function FunctionComponent({forwardedRef, optional, required}) {
      return (
        <div ref={forwardedRef}>
          <span>{optional}</span>
          <span>{required}</span>
        </div>
      );
    }

    const RefForwardingComponent = forwardRef(function NamedFunction(props, ref) {
      return <FunctionComponent {...props} forwardedRef={ref} />;
    });


    RefForwardingComponent.defaultProps = {
      optional: 'default',
    };

    const ref = createRef();

    render(<RefForwardingComponent ref={ref} optional="foo" required="bar" />, container);

    expect(ref.current.childNodes[0].childNodes[0].data).toEqual('foo');
    expect(ref.current.childNodes[1].childNodes[0].data).toEqual('bar');

    render(<RefForwardingComponent ref={ref} required="foo" />, container);

    expect(ref.current.childNodes[0].childNodes[0].data).toEqual('default');
    expect(ref.current.childNodes[1].childNodes[0].data).toEqual('foo');
  });

  it('should bailout if forwardRef is wrapped in memo', () => {
    const container = createNodeElement('div');

    const Component = props => <div ref={props.forwardedRef} />;

    let renderCount = 0;

    const RefForwardingComponent = memo(
      forwardRef((props, ref) => {
        renderCount++;
        return <Component {...props} forwardedRef={ref} />;
      }),
    );

    const ref = createRef();

    render(<RefForwardingComponent ref={ref} optional="foo" />, container);
    expect(renderCount).toBe(1);
    expect(ref.current.tagName).toBe('DIV');

    render(<RefForwardingComponent ref={ref} optional="foo" />, container);
    expect(renderCount).toBe(1);

    const differentRef = createRef();

    render(<RefForwardingComponent ref={differentRef} optional="foo" />, container);
    expect(renderCount).toBe(2);
    expect(ref.current).toBe(null);
    expect(differentRef.current.tagName).toBe('DIV');

    render(<RefForwardingComponent ref={ref} optional="bar" />, container);
    expect(renderCount).toBe(3);
  });

  it('should custom memo comparisons to compose', () => {
    const container = createNodeElement('div');

    const Component = props => <div ref={props.forwardedRef} />;

    let renderCount = 0;

    const RefForwardingComponent = memo(
      forwardRef((props, ref) => {
        renderCount++;
        return <Component {...props} forwardedRef={ref} />;
      }),
      (o, p) => o.a === p.a && o.b === p.b,
    );

    const ref = createRef();

    render(<RefForwardingComponent ref={ref} a="0" b="0" c="1" />, container);
    expect(renderCount).toBe(1);

    expect(ref.current.tagName).toBe('DIV');

    // Changing either a or b rerenders
    render(<RefForwardingComponent ref={ref} a="0" b="1" c="1" />, container);
    expect(renderCount).toBe(2);

    // Changing c doesn't rerender
    render(<RefForwardingComponent ref={ref} a="0" b="1" c="2" />, container);
    expect(renderCount).toBe(2);

    const ComposedMemo = memo(
      RefForwardingComponent,
      (o, p) => o.a === p.a && o.c === p.c,
    );

    render(<ComposedMemo ref={ref} a="0" b="0" c="0" />, container);
    expect(renderCount).toBe(3);

    // Changing just b no longer updates
    render(<ComposedMemo ref={ref} a="0" b="1" c="0" />, container);
    expect(renderCount).toBe(3);

    // Changing just a and c updates
    render(<ComposedMemo ref={ref} a="2" b="2" c="2" />, container);
    expect(renderCount).toBe(4);

    // Changing just c does not update
    render(<ComposedMemo ref={ref} a="2" b="2" c="3" />, container);
    expect(renderCount).toBe(4);

    // Changing ref still rerenders
    const differentRef = createRef();

    render(<ComposedMemo ref={differentRef} a="2" b="2" c="3" />, container);
    expect(renderCount).toBe(5);

    expect(ref.current).toBe(null);
    expect(differentRef.current.tagName).toBe('DIV');
  });
});
