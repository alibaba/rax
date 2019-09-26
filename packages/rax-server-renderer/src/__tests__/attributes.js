/* @jsx createElement */

import {createElement, useState, useEffect, createContext, useContext, useReducer} from 'rax';
import {renderToString} from '../index';

describe('renderToString', () => {
  describe('property to attribute mapping', function() {
    describe('string properties', function() {
      it('simple numbers ', () => {
        function MyComponent() {
          return <div width={30} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div width="30"></div>');
      });

      it('simple strings ', () => {
        function MyComponent() {
          return <div width={'30'} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div width="30"></div>');
      });

      it('no string prop with true value', () => {
        function MyComponent() {
          return <a href={true} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<a />');
      });

      it('no string prop with false value', () => {
        function MyComponent() {
          return <a href={false} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<a />');
      });

      it('no string prop with null value', () => {
        function MyComponent() {
          return <div width={null} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no string prop with function value', () => {
        let fun = function() {};

        function MyComponent() {
          return <div width={fun} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('no string prop with symbol value', () => {
        function MyComponent() {
          return <div width={Symbol('foo')} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });
    });

    describe('boolean properties', function() {
      it('boolean prop with true value', () => {
        function MyComponent() {
          return <div hidden={true} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden=""></div>');
      });

      it('boolean prop with false value', () => {
        function MyComponent() {
          return <div hidden={false} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('boolean prop with self value', () => {
        function MyComponent() {
          return <div hidden="hidden" />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden="hidden"></div>');
      });

      it('boolean prop with "" value', () => {
        function MyComponent() {
          return <div hidden="" />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden=""></div>');
      });

      it('boolean prop with string value', () => {
        function MyComponent() {
          return <div hidden="foo" />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden=""></div>');
      });

      it('boolean prop with array value', () => {
        function MyComponent() {
          return <div hidden={['foo', 'bar']} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden=""></div>');
      });

      it('boolean prop with object value', () => {
        function MyComponent() {
          return <div hidden={{foo: 'bar'}} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden=""></div>');
      });

      it('boolean prop with non-zero number value', () => {
        function MyComponent() {
          return <div hidden={10} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div hidden=""></div>');
      });

      it('boolean prop with zero value', () => {
        function MyComponent() {
          return <div hidden={0} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('boolean prop with null value', () => {
        function MyComponent() {
          return <div hidden={null} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('boolean prop with function value', () => {
        let fun = function() {};
        function MyComponent() {
          return <div hidden={fun} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });

      it('boolean prop with symbol value', () => {
        let fun = function() {};
        function MyComponent() {
          return <div hidden={Symbol('foo')} />;
        }

        let str = renderToString(<MyComponent />);
        expect(str).toBe('<div></div>');
      });
    });

    describe('download property (combined boolean/string attribute)', function() {
    });

    describe('className property', function() {
    });

    describe('htmlFor property', function() {
    });

    describe('numeric properties', function() {
    });

    describe('props with special meaning in Rax', function() {
    });

    describe('inline styles', function() {
    });

    describe('aria attributes', function() {
    });

    describe('cased attributes', function() {
    });

    describe('unknown attributes', function() {
    });

    describe('custom elements', () => {
    });
  });
});
