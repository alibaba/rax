import AppState from '../index';

jest.mock('universal-env', () => {
  return {
    isWeex: true,
    isWeb: false
  };
});

jest.mock('@weex-module/globalEvent', () => {
  const _handlers = {};
  return {
    addEventListener: (type, handler) => {
      _handlers[type] = handler;
    },
    fireEvent: (type) => {
      _handlers[type]();
    }
  };
}, {virtual: true});

describe('AppState in weex', () => {
  it('AppState is available', () => {
    expect(AppState.isAvailable).toBeTruthy();
  });

  it('AppState addEventListener', () => {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const globalEvent = require('@weex-module/globalEvent');
    const mockFn = jest.fn();
    AppState.addEventListener('change', mockFn);
    globalEvent.fireEvent('WXApplicationWillResignActiveEvent');
    expect(mockFn).toBeCalled();
  });

  it('AppState addEventListener error', () => {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const globalEvent = require('@weex-module/globalEvent');
    const mockFn = jest.fn();
    AppState.addEventListener('error', mockFn);
    globalEvent.fireEvent('WXApplicationWillResignActiveEvent');
    expect(mockFn).not.toBeCalled();
  });

  it('AppState removeEventListener', () => {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const globalEvent = require('@weex-module/globalEvent');
    const mockFn = jest.fn();
    AppState.addEventListener('change', mockFn);
    AppState.removeEventListener('change', mockFn);
    globalEvent.fireEvent('WXApplicationDidBecomeActiveEvent');
    expect(mockFn).not.toBeCalled();
  });

  it('AppState removeEventListener error', () => {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const globalEvent = require('@weex-module/globalEvent');
    const mockFn = jest.fn();
    AppState.removeEventListener('change', mockFn);
    globalEvent.fireEvent('WXApplicationDidBecomeActiveEvent');
    expect(mockFn).not.toBeCalled();
  });
});
