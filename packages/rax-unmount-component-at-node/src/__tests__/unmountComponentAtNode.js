/* @jsx createElement */

import { createElement, render, shared } from 'rax';
import unmountComponentAtNode from '../';

const { Host } = shared;

describe('unmountComponentAtNode', () => {
  beforeEach(() => {
    Host.driver = null;
  });

  afterEach(() => {
    Host.driver = null;
  });

  it('unmout component', () => {
    let appendChildMock = jest.fn();
    let removeChildMock = jest.fn();
    let body = {tagName: 'BODY'};

    Host.driver = {
      createElement() {
        return {tagName: 'DIV'};
      },
      appendChild: appendChildMock,
      removeChild: removeChildMock,
      removeAllEventListeners() {}
    };

    render(<div />, body);
    unmountComponentAtNode(body);

    let call = appendChildMock.mock.calls[0];
    expect(call[0].tagName).toBe('DIV');
    expect(call[1].tagName).toBe('BODY');

    let call2 = removeChildMock.mock.calls[0];
    expect(call2[0].tagName).toBe('DIV');
    expect(call2[1].tagName).toBe('BODY');
  });
});
