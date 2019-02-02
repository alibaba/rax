const { parse } = require('..');
const { baseOptions } = require('../../options');

describe('Trim text node', () => {
  it('should trim text node', () => {
    const expected = {
      attrsList: [],
      attrsMap: {},
      children: [{ text: 'hello world', type: 3 }],
      parent: undefined,
      plain: true,
      tag: 'text',
      type: 1,
    };
    expect(parse(`
      <text>
        hello world
      </text>
    `, baseOptions)).toEqual(expected);
  });

  it('can disable trim text node', () => {
    const expected = {
      attrsList: [],
      attrsMap: {},
      children: [{ text: '\n        hello world\n      ', type: 3 }],
      parent: undefined,
      plain: true,
      tag: 'text',
      type: 1,
    };
    expect(parse(`
      <text>
        hello world
      </text>
    `, Object.assign({}, baseOptions, { trimTextWhitespace: false }))).toEqual(expected);
  });
});


