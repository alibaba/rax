import { convertUnit, setDecimalPixelTransformer, getRpx, setRpx } from '..';

describe('style-unit', () => {
  describe('convertUnit', () => {
    setRpx(414 / 750);

    it('should recognize number', () => {
      expect(convertUnit(500, 'width')).toEqual('500');
    });

    it('should recognize number string', () => {
      expect(convertUnit('500', 'width')).toEqual('500');
    });

    it('should recognize px', () => {
      expect(convertUnit('276px', 'width')).toEqual('276px');
    });

    it('should recognize rem', () => {
      expect(convertUnit('500rem', 'width')).toEqual('500rem');
    });

    it('should recognize rpx', () => {
      expect(convertUnit('500rpx', 'width')).toEqual('276px');
    });

    it('should recognize vh', () => {
      expect(convertUnit('500vh', 'width')).toEqual('500vh');
    });

    it('should recognize 0', () => {
      expect(convertUnit('0', 'width')).toEqual('0');
      expect(convertUnit(0, 'width')).toEqual('0');
    });

    it('should ignore unitless prop', () => {
      expect(convertUnit(1, 'flex')).toEqual('1');
    });

    it('should recognize transform', () => {
      expect(convertUnit('500rpx 20px 500rpx', 'margin')).toEqual('276px 20px 276px');
      expect(convertUnit('translateX(500rpx) translateY(500rpx)', 'transform')).toEqual('translateX(276px) translateY(276px)');
    });
  });

  describe('exported API', () => {
    it('setDecimalPixelTransformer', () => {
      setDecimalPixelTransformer((val) => val);
      expect(convertUnit('1500rpx', 'width')).toEqual('1500rpx');
    });

    it('get and set rpx', () => {
      setRpx(500);
      expect(getRpx()).toEqual(500);
    });
  });
});
