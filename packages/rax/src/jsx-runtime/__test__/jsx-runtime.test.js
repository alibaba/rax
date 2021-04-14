import { Component, createElement, createRef } from "../../../index"
import { jsx, jsxs, jsxDEV, Fragment } from '../';

describe('Support JSX-Runtime', () => {
  it('should export all modules needed by importSource', () => {
    expect(typeof jsx).toBe('function');
    expect(typeof jsxs).toBe('function');
    expect(typeof jsxDEV).toBe('function');
    expect(typeof Fragment).toBe('function');
  });

  it('should add key', () => {
    const vnode = jsx('div', null, 'foo');
    expect(vnode.key).toBe('foo');
  });

  it('should keep ref in props', () => {
    let ref = () => null;
    let vnode = jsx('div', { ref });
    expect(vnode.ref).toBe(ref);

    ref = 'fooRef';
    vnode = jsx('div', { ref });
    expect(vnode.ref).toBe('fooRef');
  });

  it('should apply defaultProps', () => {
    class Foo extends Component {
      render() {
        return <div />;
      }
    }

    Foo.defaultProps = {
      foo: 'bar',
      fake: 'bar1',
    };

    let vnode = jsx(Foo, {}, null);
    expect(vnode.props.foo).toBe('bar');

    vnode = jsx(Foo, {fake: 'bar2'}, null);
    expect(vnode.props.fake).toBe('bar2');
  });

  it('should keep props over defaultProps', () => {
    class Foo extends Component {
      render() {
        return <div />;
      }
    }

    Foo.defaultProps = {
      foo: 'bar'
    };

    const vnode = jsx(Foo, { foo: 'baz' }, null);
    expect(vnode.props).toEqual({
      foo: 'baz'
    });
  });

  it('should set __source and __self', () => {
    const vnode = jsx('div', { class: 'foo' }, 'key', 'source', 'self');
    expect(vnode.__source).toBe('source');
    expect(vnode.__self).toBe('self');
  });

  it('should return a vnode like createElement', () => {
    const elementVNode = createElement('div', {
      class: 'foo',
      key: 'key'
    });
    const jsxVNode = jsx('div', { class: 'foo' }, 'key');
    delete jsxVNode.__self;
    delete jsxVNode.__source;
    expect(jsxVNode).toEqual(elementVNode);
  });

  it('should remove ref from props', () => {
    const ref = createRef();
    const vnode = jsx('div', { ref }, null);
    expect(vnode.props).toEqual({});
    expect(vnode.ref).toBe(ref);
  });

  it('should receive children props', () => {
    const fooProps = {children: []};
    expect(Fragment(fooProps)).toEqual([]);
  });
});
