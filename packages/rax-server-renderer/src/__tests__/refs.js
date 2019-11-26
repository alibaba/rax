/* @jsx createElement */

import {createElement, createRef, forwardRef} from 'rax';
import {renderToString} from '../index';

describe('refs', () => {
  it('should ignore ref on server', () => {
    function MyComponent() {
      return <div ref="myDiv" />;
    }

    const str = renderToString(<MyComponent />);
    expect(str).toBe('<div></div>');
  });

  it('should not run ref code on server', () => {
    let refCount = 0;

    function MyComponent() {
      return <div ref={e => refCount++} />;
    }

    const str = renderToString(<MyComponent />);
    expect(str).toBe('<div></div>');
    expect(refCount).toBe(0);
  });
});
