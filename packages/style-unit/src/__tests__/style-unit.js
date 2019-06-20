import { convertUnit, setRem } from '..';

describe('style-unit', () => {
  describe('convertUnit', () => {
    setRem(414 / 750);

    it('should recognize number', () => {
      expect(convertUnit(500, 'width')).toEqual('276px');
    });

    it('should recognize number string', () => {
      expect(convertUnit('500', 'width')).toEqual('276px');
    });

    it('should recognize px', () => {
      expect(convertUnit('276px', 'width')).toEqual('276px');
    });

    it('should recognize rem', () => {
      expect(convertUnit('500rem', 'width')).toEqual('276px');
    });

    it('should recognize rpx', () => {
      expect(convertUnit('500rpx', 'width')).toEqual('276px');
    });

    it('should recognize vh', () => {
      expect(convertUnit('500vh', 'width')).toEqual('500vh');
    });

    it('should recognize 0', () => {
      expect(convertUnit('0', 'width')).toEqual('0px');
      expect(convertUnit(0, 'width')).toEqual('0px');
    });

    it('should ignore unitless prop', () => {
      expect(convertUnit(1, 'flex')).toEqual(1);
    });
  });
});
