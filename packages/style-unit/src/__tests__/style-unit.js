import { convertUnit, setRpx, setViewportWidth } from '..';


describe('style-unit', () => {
  describe('rpx convertUnit', () => {
    // Weex
    setRpx(414 / 750);
    it('should calculate rpx to px in Weex', () => {
      expect(convertUnit('500rpx', 'width', 'weex')).toEqual('276px');
    });

    // Web
    setViewportWidth(375);
    it('should calculate rpx to vw in Web', () => {
      expect(convertUnit('375rpx', 'width', 'web')).toEqual('100vw');
    });

    // MiniApp
    it('should not calculate rpx in MiniApp', () => {
      expect(convertUnit('375rpx', 'width', 'miniApp')).toEqual('375rpx');
    });
  });
});
