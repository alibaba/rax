import { convertUnit, getViewportWidth, setViewportWidth } from '..';

jest.mock('universal-env', () => {
  return {
    isMiniApp: true,
    isWeb: false,
    isWeex: false
  };
});

describe('Mini-App style-unit', () => {
  describe('convertUnit', () => {
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
      expect(convertUnit('375rpx', 'width')).toEqual('375rpx');
    });
  });
});
