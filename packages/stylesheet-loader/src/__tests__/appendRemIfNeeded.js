'use strict';

import appendRemIfNeeded from '../appendRemIfNeeded';

describe('appendRemIfNeeded', () => {
  it('should return 0.5 with 0.5 value', () => {
    let value = appendRemIfNeeded('width', 0.5);

    expect(value).toEqual(0.5);
  });

  it('should return origin value with percent num', () => {
    let value = appendRemIfNeeded('width', '50%');

    expect(value).toEqual('50%');
  });

  it('should return origin value with px num', () => {
    let value = appendRemIfNeeded('width', '50px');

    expect(value).toEqual('50px');
  });

  it('should append rem if needed', () => {
    let value = appendRemIfNeeded('width', '50');

    expect(value).toEqual('50rem');
  });

  it('should not append rem if not needed', () => {
    let value = appendRemIfNeeded('zIndex', 1);

    expect(value).toEqual(1);
  });
});
