'use strict';
import Toast from '../index';

jest.useFakeTimers();

describe('default duration', () => {
  Toast.show('Hello');

  it('show toast', () => {
    expect(setTimeout.mock.calls.length).toBe(1);
    expect(setTimeout.mock.calls[0][1]).toBe(Toast.SHORT);
  });

  it('hide toast window', () => {
    jest.runOnlyPendingTimers();

    expect(setTimeout.mock.calls.length).toBe(3);
    expect(setTimeout.mock.calls[1][1]).toBe(0);
  });

  it('show next toast in queue', () => {
    jest.runOnlyPendingTimers();

    expect(setTimeout.mock.calls.length).toBe(3);
    expect(setTimeout.mock.calls[2][1]).toBe(600);
  });
});

it('long duration', () => {
  Toast.show('Hello', Toast.LONG);

  expect(setTimeout.mock.calls.length).toBe(4);
  expect(setTimeout.mock.calls[3][1]).toBe(Toast.LONG);
});

it('toast twice', () => {
  Toast.show('Hello', Toast.LONG);
  Toast.show('Hello', Toast.LONG);

  jest.runAllTimers();

  expect(setTimeout.mock.calls.length).toBe(12);
});
