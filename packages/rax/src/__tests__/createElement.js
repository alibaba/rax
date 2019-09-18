/* @jsx createElement */

import createElement from '../createElement';
import Host from '../vdom/host';
import render from '../render';
import ServerDriver from 'driver-server';

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
});
