import computeChangedData from '../computeChangedData';

describe('computeChangedData', () => {
  it('should works well add a prop', () => {
    const original = { foo: 1 };
    const changed = { bar: 2 };
    const expected = { foo: 1, bar: 2 };

    expect(computeChangedData(original, changed)).toEqual(expected);
  });

  it('should works well override a prop', () => {
    const original = { foo: 1 };
    const changed = { foo: 2 };
    const expected = { foo: 2 };

    expect(computeChangedData(original, changed)).toEqual(expected);
  });

  it('should works well override an object', () => {
    const original = { foo: { some: 'val' } };
    const changed = { 'foo.some': 2 };
    const expected = { foo: { some: 2 } };

    expect(computeChangedData(original, changed)).toEqual(expected);
  });

  it('should works well override an array', () => {
    const original = { foo: [{ a: 1 }] };
    const changed = { 'foo[0].a': 2, 'foo[1]': { a: 3 } };
    const expected = { foo: [{ a: 2 }, { a: 3 }] };

    expect(computeChangedData(original, changed)).toEqual(expected);
  });

  it('should works well with undefined', () => {
    const original = undefined;
    const changed = { 'foo[0].a': 2, 'foo[1]': { a: 3 } };
    const expected = { foo: [{ a: 2 }, { a: 3 }] };

    expect(computeChangedData(original, changed)).toEqual(expected);
  });

  it('should works well with releading object', () => {
    const original = undefined;
    const changed = { '.b': 2 };
    const expected = { '': { b: 2 } };

    expect(computeChangedData(original, changed)).toEqual(expected);
  });

  it('should works well with quoto', () => {
    const original = undefined;
    const changed = { 'a["b"]': 2 };
    const expected = { a: { b: 2 } };

    expect(computeChangedData(original, changed)).toEqual(expected);
  });

  it('should works well shallow equal object', () => {
    const original = { a: 1 };
    const changed = { a: 1 };
    const expected = { a: 1 };

    expect(computeChangedData(original, changed)).toEqual(expected);
  });
});
