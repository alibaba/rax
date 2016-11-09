/* @jsx createElement */

import PropTypes from '../proptypes';

describe('PropTypes', () => {
  it('Primitive types should be defined', () => {
    expect(PropTypes.array).toBeDefined();
    expect(PropTypes.bool).toBeDefined();
    expect(PropTypes.func).toBeDefined();
    expect(PropTypes.number).toBeDefined();
    expect(PropTypes.object).toBeDefined();
    expect(PropTypes.string).toBeDefined();
    expect(PropTypes.symbol).toBeDefined();
  });

  it('Custom types should be defined', () => {
    expect(PropTypes.node).toBeDefined();
    expect(PropTypes.element).toBeDefined();
    expect(PropTypes.instanceOf).toBeDefined();
    expect(PropTypes.oneOf).toBeDefined();
    expect(PropTypes.oneOfType).toBeDefined();
    expect(PropTypes.arrayOf).toBeDefined();
    expect(PropTypes.objectOf).toBeDefined();
    expect(PropTypes.shape).toBeDefined();
  });
});
