import { createElement, render } from 'rax';
import * as DriverDOM from '../';

describe('CSSPropertyOperations', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    (document.body || document.documentElement).appendChild(container);
  });

  it('should automatically append `px` to relevant styles', () => {
    const styles = {
      left: 0,
      margin: 16,
      opacity: 0.5,
      padding: '4px',
    };
    render(<div style={styles} />, container, { driver: DriverDOM });

    const targetNode = container.children[0];
    expect(targetNode.style._values).toMatchObject({ 'left': '0px', 'opacity': '0.5', 'margin': '16px', 'padding': '4px' });
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

  it('should translate `rpx` to the `vw` relative to the width of the 750 screen', () => {
    const styles = {
      width: '375rpx',
      height: '150rpx',
      margin: '75rpx 100vh'
    };
    render(<div style={styles} />, container, { driver: DriverDOM });

    const targetNode = container.children[0];
    expect(targetNode.style._values).toMatchObject({ 'width': '50vw', 'height': '20vw', 'margin': '10vw 100vh' });
  });
});
