/* @jsx createElement */

import {createElement, memo} from 'rax';
import {renderToString} from '../index';

describe('memo', () => {
  it('comparator functions are not invoked on the server', () => {
    let renderCounter1 = 0;
    let renderCounter2 = 0;

    function App(props) {
      renderCounter1++;
      return <span>{props.value}</span>;
    }

    App = memo(App, (oldProps, newProps) => {
      throw new Error('should not be invoked');
    });

    function Outer(props) {
      renderCounter2++;
      return <App value={props.value} />;
    }

    renderToString(<Outer value={1} />);
    expect(renderCounter1).toEqual(1);
    expect(renderCounter2).toEqual(1);

    renderToString(<Outer value={2} />);
    expect(renderCounter1).toEqual(2);
    expect(renderCounter2).toEqual(2);

    renderToString(<Outer value={2} />);
    expect(renderCounter1).toEqual(3);
    expect(renderCounter2).toEqual(3);
  });
});

