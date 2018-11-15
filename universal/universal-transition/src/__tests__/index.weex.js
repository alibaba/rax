import transition from '../index';

jest.mock('universal-env', () => {
  return {
    isWeex: true
  };
});

jest.mock('@weex-module/animation', () => {
  return {
    transition: (ref, options, callback) => {
      callback();
    }
  };
}, {virtual: true});

describe('transition in weex', () => {
  it('can trigger callback', () => {
    const mockFn = jest.fn();
    transition(document.body, {
      transform: 'translate(10px, 20px) scale(1.5, 1.5) rotate(90deg)'
    }, {
      timingFunction: 'ease',
      duration: 1000,
      delay: 1000
    }, mockFn);

    expect(mockFn).toBeCalled();
  });
});
