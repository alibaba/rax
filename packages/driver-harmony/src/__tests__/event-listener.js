import { createElement, render } from 'rax';
import * as DriverDOM from '../';

describe('EventListener', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    (document.body || document.documentElement).appendChild(container);
  });

  it('should dispatch events', () => {
    const mock = jest.fn();

    render(<div onClick={mock} />, container, { driver: DriverDOM });

    const targetNode = container.children[0];
    targetNode.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    expect(mock).toBeCalled();
  });
});
