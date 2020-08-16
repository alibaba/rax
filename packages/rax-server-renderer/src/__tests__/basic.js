/* @jsx createElement */

import {createElement} from 'rax';
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

    it('render a self-closing tag', () => {
      function MyComponent() {
        return <br />;
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<br>');
    });

    it('render a self-closing tag as a child', () => {
      function MyComponent() {
        return (
          <div>
            <br />
          </div>
        );
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<div><br></div>');
    });

    it('render a string', () => {
      function MyComponent() {
        return 'Hello';
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('Hello');
    });

    it('render a number', () => {
      function MyComponent() {
        return 42;
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('42');
    });

    it('render child with zero value', () => {
      const value = 0;

      function MyComponent() {
        return <span>{value}</span>;
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<span>0</span>');
    });

    it('render an array with one child', () => {
      function MyComponent() {
        return [<div key={1}>text1</div>];
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<div>text1</div>');
    });

    it('render an array with several children', () => {
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
      expect(str).toBe('<div>text1</div><span>text2</span><p>header</p><h2>footer</h2><h3>about</h3>');
    });

    it('render a nested array', () => {
      function MyComponent() {
        return [
          [<div key={1}>text1</div>],
          <span key={1}>text2</span>,
          [[[null, <p key={1} />], false]],
        ];
      }

      let str = renderToString(<MyComponent />);
      expect(str).toBe('<div>text1</div><span>text2</span><!-- _ --><p></p><!-- _ -->');
    });

    // TODO: render an iterable
    it('render an iterable', async() => {
    });

    it('render emptyish value', () => {
      expect(renderToString(0)).toBe('0');
      expect(renderToString(<div>{''}</div>)).toBe('<div></div>');
      expect(renderToString([])).toBe('');
      expect(renderToString(false)).toBe('<!-- _ -->');
      expect(renderToString(true)).toBe('<!-- _ -->');
      expect(renderToString(undefined)).toBe('<!-- _ -->');
      expect(renderToString([[[false]], undefined])).toBe('<!-- _ --><!-- _ -->');
    });
  });
});