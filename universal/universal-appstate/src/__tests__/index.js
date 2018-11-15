import AppState from '../index';

jest.mock('universal-env', () => {
  return {
    isWeex: false,
    isWeb: true
  };
});

describe('AppState', () => {
  it('AppState is unavailable', () => {
    expect(AppState.isAvailable).toBeFalsy();
  });
});
