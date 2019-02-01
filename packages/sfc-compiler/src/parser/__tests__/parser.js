const { parse } = require('../index');
const { baseOptions } = require('../../options');
const { extend } = require('../../utils');

describe('parser', () => {
  it('simple element', () => {
    const ast = parse('<h1>hello world</h1>', baseOptions);
    expect(ast.tag).toBe('h1');
    expect(ast.plain).toBe(true);
    expect(ast.children[0].text).toBe('hello world');
  });

  it('interpolation in element', () => {
    const ast = parse('<h1>{{msg}}</h1>', baseOptions);
    expect(ast.tag).toBe('h1');
    expect(ast.plain).toBe(true);
    expect(ast.children[0].expression).toBe('_s(msg)');
  });

  it('child elements', () => {
    const ast = parse('<ul><li>hello world</li></ul>', baseOptions);
    expect(ast.tag).toBe('ul');
    expect(ast.plain).toBe(true);
    expect(ast.children[0].tag).toBe('li');
    expect(ast.children[0].plain).toBe(true);
    expect(ast.children[0].children[0].text).toBe('hello world');
    expect(ast.children[0].parent).toBe(ast);
  });

  it('unary element', () => {
    const ast = parse('<hr>', baseOptions);
    expect(ast.tag).toBe('hr');
    expect(ast.plain).toBe(true);
    expect(ast.children.length).toBe(0);
  });

  it('camelCase element', () => {
    const ast = parse('<MyComponent><p>hello world</p></MyComponent>', baseOptions);
    expect(ast.tag).toBe('MyComponent');
    expect(ast.plain).toBe(true);
    expect(ast.children[0].tag).toBe('p');
    expect(ast.children[0].plain).toBe(true);
    expect(ast.children[0].children[0].text).toBe('hello world');
    expect(ast.children[0].parent).toBe(ast);
  });

  it('forbidden element', () => {
    // style
    const styleAst = parse('<style>error { color: red; }</style>', baseOptions);
    expect(styleAst.tag).toBe('style');
    expect(styleAst.plain).toBe(true);
    expect(styleAst.forbidden).toBe(true);
    expect(styleAst.children[0].text).toBe('error { color: red; }');
    // script
    const scriptAst = parse('<script type="text/javascript">alert("hello world!")</script>', baseOptions);
    expect(scriptAst.tag).toBe('script');
    expect(scriptAst.plain).toBe(false);
    expect(scriptAst.forbidden).toBe(true);
    expect(scriptAst.children[0].text).toBe('alert("hello world!")');
  });

  it('remove duplicate whitespace text nodes caused by comments', () => {
    const ast = parse('<div><a></a> <!----> <a></a></div>', extend({
      comments: true,
    }, baseOptions));
    expect(ast.children.length).toBe(3);
    expect(ast.children[0].tag).toBe('a');
    expect(ast.children[1].text).toBe('');
    expect(ast.children[2].tag).toBe('a');
  });

  it('remove text nodes between v-if conditions', () => {
    const ast = parse('<div><div v-if="1"></div> <div v-else-if="2"></div> <div v-else></div> <span></span></div>', baseOptions);
    expect(ast.children.length).toBe(2);
    expect(ast.children[0].tag).toBe('div');
    expect(ast.children[0].ifConditions.length).toBe(3);
    expect(ast.children[1].tag).toBe('span');
  });

  it('generate correct ast for 2 root elements with v-if and v-else on separate lines', () => {
    const ast = parse(`
      <div v-if="1"></div>
      <p v-else></p>
    `, baseOptions);
    expect(ast.tag).toBe('div');
    expect(ast.ifConditions[1].block.tag).toBe('p');
  });

  it('generate correct ast for 3 or more root elements with v-if and v-else on separate lines', () => {
    const ast = parse(`
      <div v-if="1"></div>
      <span v-else-if="2"></span>
      <p v-else></p>
    `, baseOptions);
    expect(ast.tag).toBe('div');
    expect(ast.ifConditions[0].block.tag).toBe('div');
    expect(ast.ifConditions[1].block.tag).toBe('span');
    expect(ast.ifConditions[2].block.tag).toBe('p');

    const astMore = parse(`
      <div v-if="1"></div>
      <span v-else-if="2"></span>
      <div v-else-if="3"></div>
      <span v-else-if="4"></span>
      <p v-else></p>
    `, baseOptions);
    expect(astMore.tag).toBe('div');
    expect(astMore.ifConditions[0].block.tag).toBe('div');
    expect(astMore.ifConditions[1].block.tag).toBe('span');
    expect(astMore.ifConditions[2].block.tag).toBe('div');
    expect(astMore.ifConditions[3].block.tag).toBe('span');
    expect(astMore.ifConditions[4].block.tag).toBe('p');
  });

  it('v-for directive basic syntax', () => {
    const ast = parse('<ul><li v-for="item in items"></li></ul>', baseOptions);
    const liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('item');
  });

  it('v-for directive iteration syntax', () => {
    const ast = parse('<ul><li v-for="(item, index) in items"></li></ul>', baseOptions);
    const liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('item');
    expect(liAst.iterator1).toBe('index');
    expect(liAst.iterator2).toBeUndefined();
  });

  it('v-for directive iteration syntax (multiple)', () => {
    const ast = parse('<ul><li v-for="(item, key, index) in items"></li></ul>', baseOptions);
    const liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('item');
    expect(liAst.iterator1).toBe('key');
    expect(liAst.iterator2).toBe('index');
  });

  it('v-for directive key', () => {
    const ast = parse('<ul><li v-for="item in items" :key="item.uid"></li></ul>', baseOptions);
    const liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('item');
    expect(liAst.key).toBe('item.uid');
  });

  it('v-for directive destructuring', () => {
    let ast = parse('<ul><li v-for="{ foo } in items"></li></ul>', baseOptions);
    let liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('{ foo }');

    // with paren
    ast = parse('<ul><li v-for="({ foo }) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('{ foo }');

    // multi-var destructuring
    ast = parse('<ul><li v-for="{ foo, bar, baz } in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('{ foo, bar, baz }');

    // multi-var destructuring with paren
    ast = parse('<ul><li v-for="({ foo, bar, baz }) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('{ foo, bar, baz }');

    // with index
    ast = parse('<ul><li v-for="({ foo }, i) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('{ foo }');
    expect(liAst.iterator1).toBe('i');

    // with key + index
    ast = parse('<ul><li v-for="({ foo }, i, j) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('{ foo }');
    expect(liAst.iterator1).toBe('i');
    expect(liAst.iterator2).toBe('j');

    // multi-var destructuring with index
    ast = parse('<ul><li v-for="({ foo, bar, baz }, i) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('{ foo, bar, baz }');
    expect(liAst.iterator1).toBe('i');

    // array
    ast = parse('<ul><li v-for="[ foo ] in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('[ foo ]');

    // multi-array
    ast = parse('<ul><li v-for="[ foo, bar, baz ] in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('[ foo, bar, baz ]');

    // array with paren
    ast = parse('<ul><li v-for="([ foo ]) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('[ foo ]');

    // multi-array with paren
    ast = parse('<ul><li v-for="([ foo, bar, baz ]) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('[ foo, bar, baz ]');

    // array with index
    ast = parse('<ul><li v-for="([ foo ], i) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('[ foo ]');
    expect(liAst.iterator1).toBe('i');

    // array with key + index
    ast = parse('<ul><li v-for="([ foo ], i, j) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('[ foo ]');
    expect(liAst.iterator1).toBe('i');
    expect(liAst.iterator2).toBe('j');

    // multi-array with paren
    ast = parse('<ul><li v-for="([ foo, bar, baz ]) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('[ foo, bar, baz ]');

    // multi-array with index
    ast = parse('<ul><li v-for="([ foo, bar, baz ], i) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('[ foo, bar, baz ]');
    expect(liAst.iterator1).toBe('i');

    // nested
    ast = parse('<ul><li v-for="({ foo, bar: { baz }, qux: [ n ] }, i, j) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('{ foo, bar: { baz }, qux: [ n ] }');
    expect(liAst.iterator1).toBe('i');
    expect(liAst.iterator2).toBe('j');

    // array nested
    ast = parse('<ul><li v-for="([ foo, { bar }, baz ], i, j) in items"></li></ul>', baseOptions);
    liAst = ast.children[0];
    expect(liAst.for).toBe('items');
    expect(liAst.alias).toBe('[ foo, { bar }, baz ]');
    expect(liAst.iterator1).toBe('i');
    expect(liAst.iterator2).toBe('j');
  });

  it('v-if directive syntax', () => {
    const ast = parse('<p v-if="show">hello world</p>', baseOptions);
    expect(ast.if).toBe('show');
    expect(ast.ifConditions[0].exp).toBe('show');
  });

  it('v-else-if directive syntax', () => {
    const ast = parse('<div><p v-if="show">hello</p><span v-else-if="2">elseif</span><p v-else>world</p></div>', baseOptions);
    const ifAst = ast.children[0];
    const conditionsAst = ifAst.ifConditions;
    expect(conditionsAst.length).toBe(3);
    expect(conditionsAst[1].block.children[0].text).toBe('elseif');
    expect(conditionsAst[1].block.parent).toBe(ast);
    expect(conditionsAst[2].block.children[0].text).toBe('world');
    expect(conditionsAst[2].block.parent).toBe(ast);
  });

  it('v-else directive syntax', () => {
    const ast = parse('<div><p v-if="show">hello</p><p v-else>world</p></div>', baseOptions);
    const ifAst = ast.children[0];
    const conditionsAst = ifAst.ifConditions;
    expect(conditionsAst.length).toBe(2);
    expect(conditionsAst[1].block.children[0].text).toBe('world');
    expect(conditionsAst[1].block.parent).toBe(ast);
  });

  it('v-once directive syntax', () => {
    const ast = parse('<p v-once>world</p>', baseOptions);
    expect(ast.once).toBe(true);
  });

  it('slot tag single syntax', () => {
    const ast = parse('<div><slot></slot></div>', baseOptions);
    expect(ast.children[0].tag).toBe('slot');
    expect(ast.children[0].slotName).toBeUndefined();
  });

  it('slot tag named syntax', () => {
    const ast = parse('<div><slot name="one">hello world</slot></div>', baseOptions);
    expect(ast.children[0].tag).toBe('slot');
    expect(ast.children[0].slotName).toBe('"one"');
  });

  it('slot target', () => {
    const ast = parse('<p slot="one">hello world</p>', baseOptions);
    expect(ast.slotTarget).toBe('"one"');
  });

  it('component properties', () => {
    const ast = parse('<my-component :msg="hello"></my-component>', baseOptions);
    expect(ast.attrs[0].name).toBe('msg');
    expect(ast.attrs[0].value).toBe('hello');
  });

  it('component "is" attribute', () => {
    const ast = parse('<my-component is="component1"></my-component>', baseOptions);
    expect(ast.component).toBe('"component1"');
  });

  it('component "inline-template" attribute', () => {
    const ast = parse('<my-component inline-template>hello world</my-component>', baseOptions);
    expect(ast.inlineTemplate).toBe(true);
  });

  it('attribute with v-on', () => {
    const ast = parse('<input type="text" name="field1" :value="msg" @input="onInput">', baseOptions);
    expect(ast.events.input.value).toBe('onInput');
  });

  it('attribute with directive', () => {
    const ast = parse('<input type="text" name="field1" :value="msg" v-validate:field1="required">', baseOptions);
    expect(ast.directives[0].name).toBe('validate');
    expect(ast.directives[0].value).toBe('required');
    expect(ast.directives[0].arg).toBe('field1');
  });

  it('attribute with modifiered directive', () => {
    const ast = parse('<input type="text" name="field1" :value="msg" v-validate.on.off>', baseOptions);
    expect(ast.directives[0].modifiers.on).toBe(true);
    expect(ast.directives[0].modifiers.off).toBe(true);
  });

  it('literal attribute', () => {
    // basic
    const ast1 = parse('<input type="text" name="field1" value="hello world">', baseOptions);
    expect(ast1.attrsList[0].name).toBe('type');
    expect(ast1.attrsList[0].value).toBe('text');
    expect(ast1.attrsList[1].name).toBe('name');
    expect(ast1.attrsList[1].value).toBe('field1');
    expect(ast1.attrsList[2].name).toBe('value');
    expect(ast1.attrsList[2].value).toBe('hello world');
    expect(ast1.attrsMap.type).toBe('text');
    expect(ast1.attrsMap.name).toBe('field1');
    expect(ast1.attrsMap.value).toBe('hello world');
    expect(ast1.attrs[0].name).toBe('type');
    expect(ast1.attrs[0].value).toBe('"text"');
    expect(ast1.attrs[1].name).toBe('name');
    expect(ast1.attrs[1].value).toBe('"field1"');
    expect(ast1.attrs[2].name).toBe('value');
    expect(ast1.attrs[2].value).toBe('"hello world"');
  });

  it('custom delimiter', () => {
    const ast = parse('<p>{msg}</p>', extend({ delimiters: ['{', '}'] }, baseOptions));
    expect(ast.children[0].expression).toBe('_s(msg)');
  });

  it('not specified getTagNamespace option', () => {
    const options = extend({}, baseOptions);
    delete options.getTagNamespace;
    const ast = parse('<svg><text>hello world</text></svg>', options);
    expect(ast.tag).toBe('svg');
    expect(ast.ns).toBeUndefined();
  });

  it('not specified mustUseProp', () => {
    const options = extend({}, baseOptions);
    delete options.mustUseProp;
    const ast = parse('<input type="text" name="field1" :value="msg">', options);
    expect(ast.props).toBeUndefined();
  });

  it('forgivingly handle < in plain text', () => {
    const options = extend({}, baseOptions);
    const ast = parse('<p>1 < 2 < 3</p>', options);
    expect(ast.tag).toBe('p');
    expect(ast.children.length).toBe(1);
    expect(ast.children[0].type).toBe(3);
    expect(ast.children[0].text).toBe('1 < 2 < 3');
  });

  it('should ignore comments', () => {
    const options = extend({}, baseOptions);
    const ast = parse('<div>123<!--comment here--></div>', options);
    expect(ast.tag).toBe('div');
    expect(ast.children.length).toBe(1);
    expect(ast.children[0].type).toBe(3);
    expect(ast.children[0].text).toBe('123');
  });

  it('should kept comments', () => {
    const options = extend({
      comments: true
    }, baseOptions);
    const ast = parse('<div>123<!--comment here--></div>', options);
    expect(ast.tag).toBe('div');
    expect(ast.children.length).toBe(2);
    expect(ast.children[0].type).toBe(3);
    expect(ast.children[0].text).toBe('123');
    expect(ast.children[1].type).toBe(3); // parse comment with ASTText
    expect(ast.children[1].isComment).toBe(true); // parse comment with ASTText
    expect(ast.children[1].text).toBe('comment here');
  });

  it('preserveWhitespace: false', () => {
    const options = extend({
      preserveWhitespace: false
    }, baseOptions);

    const ast = parse('<p>\n  Welcome to <b>SFC</b>    <i>world</i>  \n  <span>.\n  Have fun!\n</span></p>', options);
    expect(ast.tag).toBe('p');
    expect(ast.children.length).toBe(4);
    expect(ast.children[0].type).toBe(3);
    expect(ast.children[0].text).toBe('Welcome to');
    expect(ast.children[1].tag).toBe('b');
    expect(ast.children[1].children[0].text).toBe('SFC');
    expect(ast.children[2].tag).toBe('i');
    expect(ast.children[2].children[0].text).toBe('world');
    expect(ast.children[3].tag).toBe('span');
    expect(ast.children[3].children[0].text).toBe('.\n  Have fun!');
  });
});
