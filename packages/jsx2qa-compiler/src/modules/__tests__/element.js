const t = require('@babel/types');
const { _transform } = require('../element');
const { parseExpression } = require('../../parser');
const genCode = require('../../codegen/genCode');
const traverse = require('../../utils/traverseNodePath');
const adapter = require('../../adapter').quickapp;
const DynamicBinding = require('../../utils/DynamicBinding');

function genInlineCode(ast) {
  return genCode(ast, {
    comments: false, // Remove template comments.
    concise: true, // Reduce whitespace, but not to disable all.
  });
}

function genDynamicValue(dynamicValue) {
  const properties = [];
  const store = dynamicValue.getStore();
  store.map(({name, value}) => {
    properties.push(t.objectProperty(t.identifier(name), value));
  });
  return genInlineCode(t.objectExpression(properties)).code;
}

function genDynamicEvents(dynamicEvents) {
  const properties = [];
  dynamicEvents.map(({name, value}) => {
    properties.push(t.objectProperty(t.identifier(name), value));
  });
  return genInlineCode(t.objectExpression(properties)).code;
}

describe('Transform JSXElement', () => {
  describe('JSXExpressionContainer Types', () => {
    it('identifier', () => {
      const sourceCode = '<View foo={bar}>{ bar }</View>';
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode);
      const code = genInlineCode(ast).code;
      expect(code).toEqual('<View foo="{{d0}}">{{ d0 }}</View>');
      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: bar }');
    });

    it('should handle literial types', () => {
      const sourceCode = `
        <View
          bool={true}
          str={'string'}
          num={8}
          undef={undefined}
          nil={null}
          regexp={/a-z/}
          tpl={\`hello world \${exp}\`}
        >{false}{'string'}{8}{}{undefined}{null}{/a-z/}</View>
      `;
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode);

      expect(genInlineCode(ast).code).toEqual('<View bool="{{true}}" str=\'string\' num="{{8}}" nil="{{null}}" regexp="{{d0}}" tpl="hello world {{d1}}">string8{{ d0 }}</View>');

      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: /a-z/, d1: exp }');
    });

    it('should handle expression types in quickApp', () => {
      const sourceCode = `
        <View
          onFn1={(event) => { console.log(event) }}
          onFn2={(event) => console.log(event)}
          onFn3={function(event) {console.log(event)}}
          prop={this.props.foo}
          state={this.state.bar}
          member={foo.bar.c}
          call1={fn()}
          call2={foo.method()}
          conditional={a ? 1 : 2}
          conditionalComplex={a() ? 1 : 2}
          compare={a >= 1}
          math={a - 1}
          bitwise={~a}
          logical={a || b}
          stringOp={'a' + c}
          comma={a,c}
          inst={new Foo()}
          delete={delete foo.bar}
          type={typeof aaa}
          relation={'a' in b}
          group={(a + 1)}
          spread={{...{ a: 1 }}}
        />
      `;
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      const { dynamicEvents } = _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode, true);

      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: this.props.foo, d1: this.state.bar, d2: foo, d3: fn(), d4: foo.method(), d5: a, d6: a() ? 1 : 2, d7: ~a, d8: b, d9: c, d10: new Foo(), d11: delete foo.bar, d12: typeof aaa, d13: { ...{ a: 1 } } }');

      expect(genDynamicEvents(dynamicEvents)).toEqual('{ e0: event => { console.log(event); }, e1: console.log, e2: function (event) { console.log(event); } }');

      expect(genInlineCode(ast).code).toEqual('<View onFn1="{{e0}}" onFn2="{{e1}}" onFn3="{{e2}}" prop="{{d0}}" state="{{d1}}" member="{{d2.bar.c}}" call1="{{d3}}" call2="{{d4}}" conditional="{{d5 ? 1 : 2}}" conditionalComplex="{{d6}}" compare="{{d5 >= 1}}" math="{{d5 - 1}}" bitwise="{{d7}}" logical="{{d5 || d8}}" stringOp="{{\'a\' + d9}}" comma="{{d5, d9}}" inst="{{d10}}" delete="{{d11}}" type="{{d12}}" relation="{{\'a\' in d8}}" group="{{d5 + 1}}" spread="{{d13}}" />');
    });

    it('unsupported', () => {
      const dynamicValue = new DynamicBinding('d');
      expect(() => {
        _transform({
          templateAST: parseExpression('<View assign={a = 1} />'),
          dynamicValue
        });
      }).toThrowError();
    });

    it('should handle MemberExpression', () => {
      const sourceCode = '<View>{a.b.c}</View>';
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode);
      expect(genInlineCode(ast).code).toEqual('<View>{{ d0.b.c }}</View>');
      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: a }');
    });

    it('should handle nested MemberExpression', () => {
      const sourceCode = '<View>{a ? a.b[c.d] : 1}</View>';
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode);
      expect(genInlineCode(ast).code).toEqual('<View>{{ d0 ? d0.b[d1.d] : 1 }}</View>');
      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: a, d1: c }');
    });
  });

  describe('event handlers', () => {
    it('class methods', () => {
      const ast = parseExpression(`
        <View
          onClick={this.handleClick}
        />
      `);
      /**
       * { _e0: this.handleClick }
       */
      const { dynamicEvents } = _transform({
        templateAST: ast,
      }, adapter);
      expect(genDynamicEvents(dynamicEvents)).toEqual('{ e0: this.handleClick }');
      expect(genInlineCode(ast).code).toEqual('<View onClick="{{e0}}" />');
    });

    it('prop methods', () => {
      const ast = parseExpression(`
        <View
          onClick={props.onClick}
        />
      `);
      const { dynamicEvents } = _transform({
        templateAST: ast
      }, adapter);

      expect(genInlineCode(ast).code).toEqual('<View onClick="{{e0}}" />');
      expect(genDynamicEvents(dynamicEvents)).toEqual('{ e0: props.onClick }');
    });

    it('skip list', () => {
      const sourceCode = `<View a:for="{{arr}}" a:for-item="item" a:for-index="index">
        <Text>{{ item }} {{ index }}</Text>
      </View>`;
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      traverse(ast, {
        JSXExpressionContainer(p) {
          p.node.__transformed = true;
        }
      });
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode);
      expect(genDynamicValue(dynamicValue)).toEqual('{}');
    });

    it('bind methods in quickApp', () => {
      const sourceCode = `
        <View
          onClick={onClick.bind(this, { a: 1 })}
          onKeyPress={this.handleClick.bind(this, 'hello')}
        />
      `;
      const ast = parseExpression(sourceCode);
      const { dynamicEvents } = _transform({
        templateAST: ast
      }, adapter, sourceCode, true);

      expect(genInlineCode(ast).code).toEqual('<View onClick="{{e0}}" onKeyPress="{{e1}}" data-e0-arg-context="this" data-e0-arg-0="{{ { a: 1 } }}" data-e1-arg-context="this" data-e1-arg-0="{{\'hello\'}}" />');
      expect(genDynamicEvents(dynamicEvents)).toEqual('{ e0: onClick, e1: this.handleClick }');
    });
  });

  describe('list in quickApp', () => {
    it('list type', () => {
      const sourceCode = `<View>
          <block for={array.map((val, index) => {
      return {
        val: val,
        index: index
      };
    })}><View>{val}</View></block>
        </View>`;
      const ast = parseExpression(sourceCode);
      traverse(ast, {
        JSXElement(path) {
          const { node, parentPath } = path;
          if (node.openingElement.name.name === 'block') {
            path._forParams = {
              forItem: 'val',
              forIndex: 'index',
              forList: 'array'
            };
            node.__transformed = true;
          }
        }
      });
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode, true);
      expect(genInlineCode(ast).code).toEqual(`<View>
          <block for="{{(index, val) in d0}}"><View>{{ d1 }}</View></block>
        </View>`);
    });
  });


  describe('element', () => {
    it('should handle identifier', () => {
      const ast = parseExpression('<View>{foo}</View>');
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter);
      const code = genInlineCode(ast).code;
      expect(code).toEqual('<View>{{ d0 }}</View>');
      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: foo }');
    });

    it('should handle literial types', () => {
      const sourceCode = `
        <View>
          {'string'}
          {8}
          {/a-z/}
          {{ a: 1 }}
          {[0, 1, 2]}
        </View>
      `;
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode);

      expect(genInlineCode(ast).code).toEqual(`<View>
          string
          8
          {{ d0 }}
          {{ d1 }}
          {{ d2 }}
        </View>`);
      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: /a-z/, d1: { a: 1 }, d2: [0, 1, 2] }');
    });

    it('should handle expressions', () => {
      const sourceCode = `<View>
        {this.props.foo}
        {this.state.bar}
        {foo.bar.c}
        {fn()}
        {foo.method()}
        {a ? 1 : 2}
        {a >= 1}
        {a - 1}
        {~a}
        {a || b}
        {'a' + c}
        {a,c}
        {new Foo()}
        {delete foo.bar}
        {typeof aaa}
        {'a' in b}
        {(a + 1)}
        {{...{ a: 1 }}}
      </View>`;
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode);

      expect(genInlineCode(ast).code).toEqual(`<View>
        {{ d0 }}
        {{ d1 }}
        {{ d2.bar.c }}
        {{ d3 }}
        {{ d4 }}
        {{ d5 ? 1 : 2 }}
        {{ d5 >= 1 }}
        {{ d5 - 1 }}
        {{ d6 }}
        {{ d5 || d7 }}
        {{ 'a' + d8 }}
        {{ d5, d8 }}
        {{ d9 }}
        {{ d10 }}
        {{ d11 }}
        {{ 'a' in d7 }}
        {{ d5 + 1 }}
        {{ d12 }}
      </View>`);

      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: this.props.foo, d1: this.state.bar, d2: foo, d3: fn(), d4: foo.method(), d5: a, d6: ~a, d7: b, d8: c, d9: new Foo(), d10: delete foo.bar, d11: typeof aaa, d12: { ...{ a: 1 } } }');
    });

    it('should handle text', () => {
      const sourceCode = '<Text style={styles.name}>{data && data.itemTitle ? data.itemTitle : \'\'}</Text>';
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode);
      expect(genInlineCode(ast).code).toEqual('<Text style="{{d0.name}}">{{ d1 && d1.itemTitle ? d1.itemTitle : \'\' }}</Text>');
      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: styles, d1: data }');
    });

    it('should collect object expression', () => {
      const sourceCode = '<Image style={{...styles.avator, ...styles[\`\${rank}Avator\`]}} source={{ uri: avator }}></Image>';
      const ast = parseExpression(sourceCode);
      const dynamicValue = new DynamicBinding('d');
      _transform({
        templateAST: ast,
        dynamicValue
      }, adapter, sourceCode);
      expect(genInlineCode(ast).code).toEqual('<Image style="{{d0}}" source="{{ { uri: d1 } }}"></Image>');
      expect(genDynamicValue(dynamicValue)).toEqual('{ d0: { ...styles.avator, ...styles[`${rank}Avator`] }, d1: avator }');
    });

    it('unsupported', () => {
      expect(() => {
        _transform({
          templateAST: parseExpression('<View>{a = 1}</View>')
        });
      }).toThrowError();
    });
  });
});
