'use strict';

import PropTypes from '../PropTypes';

describe('PropTypes', () => {
  it('should check length type', () => {
    expect(PropTypes.length('16rem')).toBeNull();
    expect(PropTypes.length('red')).not.toBeNull();
  });

  it('should check number type', () => {
    expect(PropTypes.number('16.2')).toBeNull();
    expect(PropTypes.number('16.5px')).not.toBeNull();
  });

  it('should check integer type', () => {
    expect(PropTypes.integer('16')).toBeNull();
    expect(PropTypes.integer('16px')).not.toBeNull();
  });

  it('should check enum type', () => {
    const list = ['red', 'blue'];

    expect(PropTypes.oneOf(list)('red')).toBeNull();
    expect(PropTypes.oneOf(list)('gray')).not.toBeNull();
  });

  it('should check color type', () => {
    expect(PropTypes.color('red')).toBeNull();
    expect(PropTypes.color('#666')).toBeNull();
    expect(PropTypes.color('rgb(255, 0, 0)')).toBeNull();
    expect(PropTypes.color('16px')).not.toBeNull();
  });
});
