/* @jsx createElement */

import {createElement, useState, useEffect, createContext, useContext, useReducer} from 'rax';
import {renderToString} from '../index';

describe('renderToString', () => {
  describe('basic rendering', function() {
    it('render a blank div', () => {
      function MyComponent() {
        return <div />;
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<div></div>');
    });

    it('a self-closing tag', () => {
      function MyComponent() {
        return <br />;
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<br />');
    });

    it('a self-closing tag as a child', () => {
      function MyComponent() {
        return (
          <div>
            <br />
          </div>
        );
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<div><br /></div>');
    });

    it('a string', () => {
      function MyComponent() {
        return 'Hello';
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('Hello');
    });

    it('a number', () => {
      function MyComponent() {
        return 42;
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe(42);
    });

    it('an array with one child', () => {
      function MyComponent() {
        return [<div key={1}>text1</div>];
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe(42);
    });

    it('an array with several children', () => {
      let Header = props => {
        return <p>header</p>;
      };
      let Footer = props => {
        return [<h2 key={1}>footer</h2>, <h3 key={2}>about</h3>];
      };

      function MyComponent() {
        return [
          <div key={1}>text1</div>,
          <span key={2}>text2</span>,
          <Header key={3} />,
          <Footer key={4} />,
        ];
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe(42);
    });

    it('a nested array', () => {
      function MyComponent() {
        return [
          [<div key={1}>text1</div>],
          <span key={1}>text2</span>,
          [[[null, <p key={1} />], false]],
        ];
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe(42);
    });

    it('an iterable', () => {
      // ....
    });

    it('emptyish value', () => {
      expect(renderToString(0)).toBe(0);
      expect(renderToString(<div>{''}</div>)).toBe('<div></div>');
      expect(renderToString([])).toBe(null);
      expect(renderToString(false)).toBe(null);
      expect(renderToString(true)).toBe(null);
      expect(renderToString(undefined)).toBe(null);
      expect(renderToString([[[false]], undefined])).toBe(null);
    });
  });
});