/* @jsx createElement */

import findDOMNode from '../';
import {Component, createElement, render, shared} from 'rax';
import ServerDriver from 'driver-server';
import unmountComponentAtNode from 'rax-unmount-component-at-node';

const { Host } = shared;

describe('findDOMNode', () => {
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

  it('findDOMNode with null', () => {
    let node = findDOMNode(null);
    expect(node).toBeNull();
  });

  it('findDOMNode with node', () => {
    let node = findDOMNode({
      ownerDocument: {}
    });

    expect(node).toEqual({
      ownerDocument: {}
    });

    let node2 = findDOMNode({
      nodeType: 1
    });

    expect(node2).toEqual({
      nodeType: 1
    });
  });

  it('findDOMNode with native component', () => {
    let node = findDOMNode({
      _nativeNode: {}
    });

    expect(node).toEqual({});
  });


  it('findDOMNode with composite component', () => {
    let node = findDOMNode({
      _internal: {
        _renderedComponent: {
          _nativeNode: {
            nodeType: 1
          }
        }
      },
      render() {}
    });

    expect(node).toEqual({
      nodeType: 1
    });

    let node2 = findDOMNode({
      _internal: {
        _renderedComponent: {
          _renderedComponent: {
            _nativeNode: {
              nodeType: 2
            }
          }
        }
      },
      render() {}
    });

    expect(node2).toEqual({
      nodeType: 2
    });

    let node3 = findDOMNode({
      _internal: {
        _renderedComponent: {
          _renderedComponent: null
        }
      },
      render() {}
    });

    expect(node3).toEqual(null);
  });

  it('findDOMNode should reject random objects', function() {
    expect(function() {
      findDOMNode({foo: 'bar'});
    }).toThrowError(
      'findDOMNode: find by neither component nor DOM node.'
    );
  });

  it('findDOMNode should reject unmounted objects with render func', function() {
    class Foo extends Component {
      render() {
        return <div />;
      }
    }

    let container = createNodeElement('div');
    var inst = render(<Foo />, container);
    unmountComponentAtNode(container);

    expect(() => findDOMNode(inst)).toThrowError(
      'findDOMNode: find on an unmounted component.'
    );
  });

  it('findDOMNode should not throw an error when called within a component that is not mounted', function() {
    class Bar extends Component {
      componentWillMount() {
        expect(findDOMNode(this)).toBeNull();
      }

      render() {
        return <div />;
      }
    }

    expect(() => render(<Bar />)).not.toThrow();
  });
});
