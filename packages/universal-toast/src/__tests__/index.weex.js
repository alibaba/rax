import Toast from '../index';

const mockWeexToast = jest.fn();

jest.mock('@weex-module/modal', () => {
  return {
    toast: mockWeexToast
  };
}, {virtual: true});

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

describe('toast in weex', () => {
  it('weex toast to be called', () => {
    Toast.show('Hello');
    expect(mockWeexToast).toBeCalled();
  });
});