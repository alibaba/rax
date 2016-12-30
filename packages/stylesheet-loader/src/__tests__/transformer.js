'use strict';

import transformer from '../transformer';
import css from 'css';

describe('transformer', () => {
  it('should replace some characters of selector', () => {
    const result = transformer.sanitizeSelector('.abc');

    expect(result).toEqual('abc');
  });

  it('should transform nested selector when set transformDescendantCombinator to true', () => {
    const result = transformer.sanitizeSelector('.a .b', true);

    expect(result).toEqual('a_b');
  });

  it('should return null when writing multiple selectors', () => {
    const result = transformer.sanitizeSelector('.abc .bcd');

    expect(result).toBe(null);
  });

  it('should convert prop with camelCase', () => {
    const flexDirection = transformer.convertProp('flex-direction');
    const boxOrientWebkit = transformer.convertProp('-webkit-box-orient');
    const boxOrientMoz = transformer.convertProp('-moz-box-orient');
    const boxOrientO = transformer.convertProp('-o-box-orient');

    expect(flexDirection).toEqual('flexDirection');
    expect(boxOrientWebkit).toEqual('WebkitBoxOrient');
    expect(boxOrientMoz).toEqual('MozBoxOrient');
    expect(boxOrientO).toEqual('oBoxOrient');
  });

  it('should remove px of value', () => {
    const valueWithPx = transformer.convertValue('width', '16px');
    const valueNoWithPx = transformer.convertValue('width', '16');

    expect(valueWithPx).toEqual('16px');
    expect(valueNoWithPx).toEqual(16);
  });

  it('should convert the rule object to stylesheet object', () => {
    const source = `
      .container {
        width: 750;
        height: 800;
      }
      .header_content {
        width: 750;
        height: 200;
        border: '1 solid red';
      }
    `;
    const stylesheet = css.parse(source).stylesheet;
    let data = {};

    stylesheet.rules.forEach(function(rule) {
      let style = {};

      if (rule.type === 'rule') {
        style = transformer.convert(rule);
      }

      rule.selectors.forEach(function(selector) {
        const sanitizedSelector = transformer.sanitizeSelector(selector);
        data[sanitizedSelector] = style;
      });
    });

    expect(data.container.width).toEqual(750);
    expect(data.container.height).toEqual(800);
    expect(data.header_content.width).toEqual(750);
    expect(data.header_content.height).toEqual(200);
  });
});
