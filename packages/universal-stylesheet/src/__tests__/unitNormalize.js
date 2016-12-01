'use strict';

import unitNormalize from '../unitNormalize';

describe('unitNormalize', () => {
  it('should append rem', () => {
    expect(unitNormalize('width', 80)).toBe('80rem');
  });

  it('should return origin value when has rem unit', () => {
    expect(unitNormalize('width', '80rem')).toBe('80rem');
  });

  it('should not append rem when prop is unitless', () => {
    expect(unitNormalize('lines', 3)).toBe(3);
  });
});
