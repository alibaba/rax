'use strict';

import normalizeColor from '../normalizeColor';

describe('normalizeColor', () => {
  it('should accept only spec compliant colors', () => {
    expect(normalizeColor('#abc')).not.toBe(null);
    expect(normalizeColor('#abcd')).not.toBe(null);
    expect(normalizeColor('#abcdef')).not.toBe(null);
    expect(normalizeColor('#abcdef01')).not.toBe(null);
    expect(normalizeColor('rgb(1,2,3)')).not.toBe(null);
    expect(normalizeColor('rgb(1, 2, 3)')).not.toBe(null);
    expect(normalizeColor('rgb(   1   , 2   , 3   )')).not.toBe(null);
    expect(normalizeColor('rgba(0, 0, 0, 1)')).not.toBe(null);
  });

  it('should temporarly accept floating point values for rgb', function() {
    expect(normalizeColor('rgb(1.1, 2.1, 3.1)')).toBe('rgb(1,2,3)');
    expect(normalizeColor('rgba(1.1, 2.1, 3.1, 1.0)')).toBe('rgb(1,2,3)');
  });

  it('should handle hex6 properly', function() {
    expect(normalizeColor('#000000')).toBe('rgb(0,0,0)');
    expect(normalizeColor('#ffffff')).toBe('rgb(255,255,255)');
    expect(normalizeColor('#ff00ff')).toBe('rgb(255,0,255)');
    expect(normalizeColor('#abcdef')).toBe('rgb(171,205,239)');
    expect(normalizeColor('#012345')).toBe('rgb(1,35,69)');
  });

  it('should handle hex3 properly', () => {
    expect(normalizeColor('#000')).toBe('rgb(0,0,0)');
    expect(normalizeColor('#fff')).toBe('rgb(255,255,255)');
    expect(normalizeColor('#f0f')).toBe('rgb(255,0,255)');
  });

  it('should handle hex8 properly', () => {
    expect(normalizeColor('#00000000')).toBe('rgba(0,0,0,0)');
    expect(normalizeColor('#ffffffff')).toBe('rgb(255,255,255)');
    expect(normalizeColor('#ffff00ff')).toBe('rgb(255,255,0)');
    expect(normalizeColor('#abcdef01')).toBe('rgba(171,205,239,0.00392156862745098)');
    expect(normalizeColor('#01234567')).toBe('rgba(1,35,69,0.403921568627451)');
  });

  it('should handle rgb properly', () => {
    expect(normalizeColor('rgb(0, 0, 0)')).toBe('rgb(0,0,0)');
    expect(normalizeColor('rgb(0, 0, 255)')).toBe('rgb(0,0,255)');
    expect(normalizeColor('rgb(100, 15, 69)')).toBe('rgb(100,15,69)');
    expect(normalizeColor('rgb(255, 255, 255)')).toBe('rgb(255,255,255)');
  });

  it('should handle rgba properly', () => {
    expect(normalizeColor('rgba(0, 0, 0, 0.0)')).toBe('rgba(0,0,0,0)');
    expect(normalizeColor('rgba(0, 0, 0, 0)')).toBe('rgba(0,0,0,0)');
    expect(normalizeColor('rgba(0, 0, 0, 1.0)')).toBe('rgb(0,0,0)');
    expect(normalizeColor('rgba(0, 0, 0, 1)')).toBe('rgb(0,0,0)');
    expect(normalizeColor('rgba(100, 15, 69, 0.5)')).toBe('rgba(100,15,69,0.5)');
  });

  it('should handle hsl properly', () => {
    expect(normalizeColor('hsl(0, 0%, 0%)')).toBe('rgb(0,0,0)');
    expect(normalizeColor('hsl(360, 100%, 100%)')).toBe('rgb(255,255,255)');
    expect(normalizeColor('hsl(180, 50%, 50%)')).toBe('rgb(64,191,191)');
    expect(normalizeColor('hsl(70, 25%, 75%)')).toBe('rgb(202,207,175)');
    expect(normalizeColor('hsl(70, 100%, 75%)')).toBe('rgb(234,255,128)');
    expect(normalizeColor('hsl(70, 0%, 75%)')).toBe('rgb(191,191,191)');
  });
});
