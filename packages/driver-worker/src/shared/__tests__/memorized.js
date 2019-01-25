import memorized from '../memorized';

describe('memorized', () => {
  it('should memory a pure function', () => {
    let count = 0;
    const fn = memorized((str) => count++);

    expect(fn('key')).toEqual(0);
    // Memorized by 'key'.
    expect(fn('key')).toEqual(0);
    // A new argument.
    expect(fn('foo')).toEqual(1);
    // Arguments length effects.
    expect(fn('foo', true)).toEqual(2);
  });
});
