import transition from '../index';

jest.mock('universal-env', () => {
  return {
    isWeb: true
  };
});

describe('transition', () => {
  let transitionendEvent;

  beforeEach(() => {
    transitionendEvent = document.createEvent('HTMLEvents');
    transitionendEvent.initEvent('transitionend', false, true);
  });
  it('can trigger callback', (done) => {
    const mockFn = jest.fn(() => {
      done();
    });
    transition(document.body, {
      transform: 'translate(10px, 20px) scale(1.5, 1.5) rotate(90deg)'
    }, {
      timingFunction: 'ease',
      duration: 1000,
      delay: 1000
    }, mockFn);
    document.body.dispatchEvent(transitionendEvent);

    expect(mockFn).toBeCalled();
  });

  it('callback as the third parameter when option is function', () => {
    const mockFn = jest.fn();
    transition(document.body, {
      transform: 'translate(10px, 20px) scale(1.5, 1.5) rotate(90deg)'
    }, mockFn);
    document.body.dispatchEvent(transitionendEvent);

    expect(mockFn).toBeCalled();
  });
});
