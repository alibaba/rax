import createEmptyElement from '../createEmptyElement';

describe('createEmptyElement', () => {
  it('should return null anyway', () => {
    const el = createEmptyElement(
      'view',
      ['hello world']
    );
    expect(el).toBeNull();
  });
});
