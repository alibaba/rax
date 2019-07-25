import createStyle from '../createStyle';

describe('Create style', () => {
  describe('Types', () => {
    it('should accept null or undefined', () => {
      expect(createStyle(null)).toEqual('');
      expect(createStyle(undefined)).toEqual('');
    });

    it('should accept object', () => {
      const style = createStyle({
        color: 'red',
        background: 'yellow',
        fontSize: '20px',
      });
      expect(style).toEqual('color: red; background: yellow; font-size: 20px;');
    });

    it('should accept array', () => {
      const style = createStyle([{
        color: 'red',
        background: 'yellow',
        fontSize: '20px',
      }]);
      expect(style).toEqual('color: red; background: yellow; font-size: 20px;');
    });

    it('should accept string', () => {
      const style = createStyle('color: red; background: yellow; font-size: 20px;');
      expect(style).toEqual('color: red; background: yellow; font-size: 20px;');
    });
  });

  describe('functional', () => {
    it('should not transform unit', () => {
      const style = createStyle({
        fontSize: '20rpx',
      });
      expect(style).toEqual('font-size: 20rpx;');
    });

    it('should transform camelcase', () => {
      const style = createStyle({
        transitionTimingFunction: 'ease-in-out',
      });
      expect(style).toEqual('transition-timing-function: ease-in-out;');
    });

    it('should reserve kebabcase', () => {
      const style = createStyle({
        'transition-timing-function': 'ease-in-out',
      });
      expect(style).toEqual('transition-timing-function: ease-in-out;');
    });
  });
});
