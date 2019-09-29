import { createElement, render } from 'rax';
import DriverUniversalDOM from '../dom';

describe('Transform rpx', () => {
  const CLIENT_WIDTH = 414;

  it('CSS custom properties works.', () => {
    global.DEVICE_WIDTH = CLIENT_WIDTH;

    const container = document.createElement('div');
    render((
      <div style={{
        margin: '100rpx 100vh'
      }} />
    ), container, {
      driver: DriverUniversalDOM
    });

    expect(container.childNodes[0].style.margin).toEqual('55.2px 100vh');
  });
});
