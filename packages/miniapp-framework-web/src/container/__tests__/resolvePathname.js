import resolvePathname from '../resolve-pathname';

describe('resolvePathname', () => {
  describe('from a file path', () => {
    const from = '/public/index.html';

    it('should resolve abs path', () => {
      const to = '/abs.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/abs.js');
    });

    it('should resolve relative path #1', () => {
      const to = 'app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/public/app.js');
    });

    it('should resolve relative path #2', () => {
      const to = './app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/public/app.js');
    });

    it('should resolve relative path #3', () => {
      const to = '../app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/app.js');
    });

    it('should resolve relative path #4', () => {
      const to = 'foo/app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/public/foo/app.js');
    });

    it('should resolve wiered path', () => {
      const to = '.././foo/../bar/./app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/bar/app.js');
    });
  });

  describe('from a directory path', () => {
    const from = '/public/';

    it('should resolve abs path', () => {
      const to = '/abs.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/abs.js');
    });

    it('should resolve relative path #1', () => {
      const to = 'app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/public/app.js');
    });

    it('should resolve relative path #2', () => {
      const to = './app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/public/app.js');
    });

    it('should resolve relative path #3', () => {
      const to = '../app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/app.js');
    });

    it('should resolve relative path #4', () => {
      const to = 'foo/app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/public/foo/app.js');
    });

    it('should resolve wiered path', () => {
      const to = '.././foo/../bar/./app.js';
      const result = resolvePathname(to, from);
      expect(result).toEqual('/bar/app.js');
    });
  });
});
