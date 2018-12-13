import camelCase from '../camelCase';

describe('camel case', () => {
  it('should transform -foo-bar', () => {
    expect(camelCase('-foo-bar')).toBe('FooBar');
  });

  it('should transform foo-bar', () => {
    expect(camelCase('foo-bar')).toBe('fooBar');
  });

  it('should not transform foobar', () => {
    expect(camelCase('foobar')).toBe('foobar');
  });

  it('should not transform fooBar', () => {
    expect(camelCase('fooBar')).toBe('fooBar');
  });
});
