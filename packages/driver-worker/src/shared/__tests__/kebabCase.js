import kebabCase from '../kebabCase';

describe('kebab case', () => {
  it('should transform fooBar', () => {
    expect(kebabCase('fooBar')).toBe('foo-bar');
  });

  it('should transform FooBar', () => {
    expect(kebabCase('FooBar')).toBe('-foo-bar');
  });

  it('should not transform foo-bar', () => {
    expect(kebabCase('foo-bar')).toBe('foo-bar');
  });

  it('should not transform foobar', () => {
    expect(kebabCase('foobar')).toBe('foobar');
  });
});

