const { cached, extend, no, log, warn, error, makeMap } = require('../utils');

describe('utils', () => {
  it('cached', () => {
    const fn = cached((exp) => eval(exp));
    expect(fn('1 + 2')).toEqual(3);
  });

  it('extend', () => {
    const to = {};
    extend(to, { foo: 'bar' });
    expect(to).toEqual({
      foo: 'bar',
    });
  });

  it('no', () => {
    expect(no()).toEqual(false);
  });

  it('log', () => {
    expect(
      log('Hello world!')
    ).toBeUndefined();

    expect(
      warn('Hello world!')
    ).toBeUndefined();

    expect(
      error('Hello world!')
    ).toBeUndefined();
  });

  it('makeMap', () => {
    const isSth = makeMap('hello,world');
    expect(isSth('hello')).toBeTruthy();
    expect(isSth('world')).toBeTruthy();
    expect(isSth('sth')).toBeFalsy();
  });
});
