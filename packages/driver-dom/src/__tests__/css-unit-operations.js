import { createElement, render } from 'rax';
import * as DriverDOM from '../';

describe('CSSPropertyOperations', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    (document.body || document.documentElement).appendChild(container);
  });

  it('should not append `px` to styles that might need a number', () => {
    const styles = {
      flex: 1,
      flexGrow: 0,
      lineHeight: 1.1,
      opacity: 0.5,
    };
    render(<div style={styles} />, container, { driver: DriverDOM });

    const targetNode = container.children[0];
    expect(targetNode.style._values).toMatchObject({ 'flex': '1', 'opacity': '0.5', 'flex-grow': '0', 'line-height': 1.1 });
  });
});
