import { convertUnit, getViewportWidth, setViewportWidth } from '..';

jest.mock('universal-env', () => {
  return {
    isMiniApp: false,
    isWeb: true,
    isWeex: false
  };
});

describe('Web style-unit', () => {
  describe('convertUnit', () => {
    setViewportWidth(375);
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
      expect(convertUnit('375rpx', 'width')).toEqual('100vw');
    });

    it('should recognize vh', () => {
      expect(convertUnit('500vh', 'width')).toEqual('500vh');
    });

    it('should recognize 0', () => {
      expect(convertUnit('0', 'width')).toEqual('0');
      expect(convertUnit(0, 'width')).toEqual('0');
    });

    it('should recognize transform', () => {
      expect(convertUnit('375rpx 20px 375rpx', 'margin')).toEqual('100vw 20px 100vw');
      expect(convertUnit('translateX(375rpx) translateY(375rpx)', 'transform')).toEqual('translateX(100vw) translateY(100vw)');
    });
  });

  describe('exported API', () => {
    it('get and set viewportWidth', () => {
      setViewportWidth(500);
      expect(getViewportWidth()).toEqual(500);
    });
  });
});
