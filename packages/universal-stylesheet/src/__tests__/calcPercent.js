'use strict';

import calcPercent from '../calcPercent';

describe('calcPercent', () => {
  it('should calc percent unit', () => {
    expect(calcPercent('width', '80%')).toBe(300);
    expect(calcPercent('height', '50%')).toBe(333.5);
  });

  it('should return origin value when no percent', () => {
    expect(calcPercent('width', 80)).toBe(80);
  });
});
