/* @jsx createElement */

import isValidElement from '../';

describe('isValidElement', () => {
  it('Return type of isValidElement should be boolean type', () => {
    expect(isValidElement()).toBe(false);
    expect(isValidElement(null)).toBe(false);
    expect(isValidElement({})).toBe(false);
    expect(isValidElement({type: 'div'})).toBe(false);

    expect(isValidElement({
      type: 'div',
      props: {}
    })).toBe(true);
    expect(isValidElement({
      type: 'div',
      props: {
        style: {}
      }
    })).toBe(true);
  });
});
