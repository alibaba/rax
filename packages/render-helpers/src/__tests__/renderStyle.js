import renderStyle from '../renderStyle';

describe('renderStyle', () => {
  describe('style binding', () => {
    it('should accept array', () => {
      const style = renderStyle([
        { color: 'red' },
        { background: 'yellow' }
      ]);
      expect(style).toMatchSnapshot();
    });

    it('should accept string', () => {
      const style = renderStyle('color: red;');
      expect(style).toEqual({ color: 'red' });
    });

    it('should accept object', () => {
      const style = renderStyle({ color: 'red' });
      expect(style).toEqual({ color: 'red' });
    });
  });

  describe('static style', () => {
    it('should accept string', () => {
      const style = renderStyle('color: red;', 'color: yellow');
      expect(style).toEqual({ color: 'yellow' });
    });

    it('should accept object', () => {
      const style = renderStyle({ color: 'red' }, { color: 'yellow' });
      expect(style).toEqual({ color: 'yellow' });
    });
  });

  describe('cssInJS mode', () => {
    const styleObject = {
      group: {
        color: 'grey',
        width: '100rpx',
        height: '200rpx',
      },
      item: {
        position: 'absolute',
        width: '300px',
        top: 0,
        left: '30px',
        margin: '10px',
      },
    };
    it('should merge css object in css in js mode', () => {
      const style = renderStyle(
        { color: 'red' },
        { color: 'yellow' },
        styleObject,
        ['item', { group: true }, 5]
      );
      expect(style).toEqual({
        position: 'absolute',
        top: 0,
        left: '30px',
        margin: '10px',
        color: 'yellow',
        width: '100rpx',
        height: '200rpx',
      });
    });
  });
});
