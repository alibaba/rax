import toString from '../toString';

describe('toString', () => {
  describe('types', () => {
    it('should accept number', () => {
      expect(toString(1)).toEqual('1');
    });

    it('should accept string', () => {
      expect(toString('hello')).toEqual('hello');
    });

    it('should accept undefined', () => {
      expect(toString(undefined)).toEqual('');
    });

    it('should accept null', () => {
      expect(toString(null)).toEqual('');
    });

    it('should accept object', () => {
      expect(toString({ a: 1 })).toEqual(JSON.stringify({ a: 1 }, null, 2));
    });

    it('should accept array', () => {
      expect(toString([0, 1, 2])).toEqual(JSON.stringify([0, 1, 2], null, 2));
    });

    it('should accept function', () => {
      expect(toString(function() {
        return 'hello world';
      }))
        .toMatchSnapshot();
    });
  });
});
