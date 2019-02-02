import deepCopy from '../deepCopy';

describe('deepCopy', () => {
  it('simple copy', () => {
    const data = {
      foo: 'bar',
      hello: {
        world: 'world'
      },
      items: [0, 1, 2, 3],
      fn: () => {
        return 1;
      },
    };

    data.data = data;
    expect(deepCopy(data)).toEqual(data);
  });

  describe('deep copy targets', () => {
    it('can copy boolean', function() {
      expect(deepCopy(true)).toBe(true);
      expect(deepCopy(false)).toBe(false);
    });

    it('can copy Boolean', function() {
      const data = new Boolean(false);
      const result = deepCopy(data);

      expect(result).toBeInstanceOf(Boolean);
      expect(data).not.toBe(result);
      expect(data.valueOf()).toEqual(result.valueOf());
    });

    it('can copy Date', function() {
      const data = new Date();
      const result = deepCopy(data);

      expect(result).toBeInstanceOf(Date);
      expect(data).not.toBe(result);
      expect(data.getTime()).toEqual(result.getTime());
    });

    it('can copy null', function() {
      expect(deepCopy(null)).toBeNull();
    });

    it('can copy number', function() {
      expect(deepCopy(0)).toEqual(0);
      expect(deepCopy(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
      expect(deepCopy(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
      expect(deepCopy(Number.POSITIVE_INFINITY)).toEqual(Number.POSITIVE_INFINITY);
      expect(deepCopy(Number.NEGATIVE_INFINITY)).toEqual(Number.NEGATIVE_INFINITY);
      expect(Number.isNaN(deepCopy(NaN))).toBeTruthy();
    });

    it('can copy Number', function() {
      const data = new Number(65535);
      const result = deepCopy(data);

      expect(result).toBeInstanceOf(Number);
      expect(data).not.toBe(result);
      expect(data.valueOf()).toEqual(result.valueOf());
    });

    it('can copy RegExp', function() {
      const data = new RegExp('', 'i');
      const result = deepCopy(data);

      expect(result).toBeInstanceOf(RegExp);
      expect(data).not.toBe(result);
      expect(String(data)).toEqual(String(result));
    });

    it('can copy string', function() {
      expect(deepCopy('Hello!')).toEqual('Hello!');
    });

    it('can copy String', function() {
      const data = new String('Hello!');
      const result = deepCopy(data);

      expect(result).toBeInstanceOf(String);
      expect(data).not.toBe(result);
      expect(data.valueOf()).toEqual(result.valueOf());
    });

    it('can copy symbol', function() {
      if (typeof Symbol === 'undefined') {
        return this.skip();
      }

      const data = Symbol();
      const result = deepCopy(data);

      expect(data).toEqual(result);
    });

    it('can copy undefined', function() {
      expect(deepCopy(undefined)).toBeUndefined();
    });
  });

  describe('shallow copy targets', function() {
    it('can shallow copy function', function() {
      const data = new Function();
      const result = deepCopy(data);

      expect(data).toEqual(result);
    });

    it('can shallow copy Promise', function() {
      const data = new Promise(function() {});
      const result = deepCopy(data);

      expect(data).toBe(result);
    });

    it('can shallow copy WeakMap', function() {
      const data = new WeakMap();
      const result = deepCopy(data);

      expect(data).toEqual(result);
    });

    it('can shallow copy WeakSet', function() {
      const data = new WeakSet();
      const result = deepCopy(data);

      expect(data).toEqual(result);
    });
  });

  it('can copy custom instance', () => {
    const list = {
      foo: '1',
      __proto__: {
        bar: '2',
      },
    };

    expect(() => {
      deepCopy(list);
    }).not.toThrowError();
    const newList = deepCopy(list);
    expect(newList.foo).toEqual('1');
    expect(newList.bar).toEqual('2');
  });
});
