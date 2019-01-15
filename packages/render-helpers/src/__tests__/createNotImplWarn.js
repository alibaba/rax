import createNotImplWarn from '../createNotImplWarn';

describe('createNotImplWarn', () => {
  it('should create impl warn with alias', () => {
    const fn = createNotImplWarn('sth', () => 'view');
    expect(fn()).toEqual('view');
  });

  it('should create empty element without alias', () => {
    const fn = createNotImplWarn('sth');
    expect(fn()).toBeNull();
  });
});
