const { join } = require('path');
const { transformNode, genData } = require('../template');

describe('Transpile module: template', () => {
  it('import', () => {
    const src = './__files__/template.axml';
    const el = {
      tag: 'import',
      attrsMap: { src },
      attrsList: [{
        name: 'src', value: src,
      }]
    };
    transformNode(el, { templatePath: __filename });
    expect(el.isComment).toEqual(true);
    expect(el.attrsList).toEqual([]);
    expect(el.type).toEqual(3);
    expect(el.templates).toEqual([join(__dirname, src)]);
    expect(genData(el)).toMatchSnapshot();
  });

  it('template register', () => {
    const name = 'foo';
    const el = {
      tag: 'template',
      attrsMap: { name },
      attrsList: [{
        name: 'name', value: name,
      }]
    };
    transformNode(el, {});
    expect(el.tplAlias).toEqual(name);
    expect(el.tplASTs[name]).toEqual(el);
    expect(genData(el)).toMatchSnapshot();
  });

  it('template usage', () => {
    const is = 'foo';
    const el = {
      tag: 'template',
      attrsMap: { is },
      attrsList: [{
        name: 'is', value: is,
      }]
    };
    transformNode(el, {});

    expect(el).toMatchSnapshot();
    expect(genData(el)).toMatchSnapshot();
  });

  it('include', () => {
    const src = './__files__/template.axml';
    const el = {
      tag: 'include',
      attrsMap: { src },
      attrsList: [{
        name: 'src', value: src,
      }]
    };
    transformNode(el, { templatePath: __filename });

    expect(el).toMatchSnapshot();
    expect(genData(el)).toMatchSnapshot();
  });
});
