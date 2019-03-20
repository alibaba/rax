const { generateElement } = require('../codegen');

describe('Generate template', () => {
  it ('should generate template', () => {
    const node = {
      tag: 'text',
      attrs: {
        foo: "{{bar}}",
      },
      children: ['hello']
    };
    expect(generateElement(node)).toEqual('<text foo="{{bar}}">hello</text>');
  });

  it ('should generate self-close tag', () => {
    const node = {
      tag: 'import',
      attrs: {
        src: "./foo.axml",
      },
    };
    expect(generateElement(node)).toEqual('<import src="./foo.axml" />');
  });

  it ('should generate nested', () => {
    const node = {
      tag: 'view',
      attrs: {
        foo: "{{bar}}",
      },
      children: [{
        tag: 'text',
        attrs: {
          a: false,
          'a:if': '{{condition}}',
        },
        children: ['aaaa']
      }]
    };
    expect(generateElement(node))
      .toEqual('<view foo="{{bar}}"><text a:if="{{condition}}">aaaa</text></view>');
  });
});
