const t = require('@babel/types');
const { _transform } = require('../element');
const { parseExpression } = require('../../parser');
const genCode = require('../../codegen/genCode');
const traverse = require('../../utils/traverseNodePath');

function genInlineCode(ast) {
  return genCode(ast, {
    comments: false, // Remove template comments.
    concise: true, // Reduce whitespace, but not to disable all.
  });
}

function genDynamicAttrs(dynamicValue) {
  const properties = [];
  Object.keys(dynamicValue).forEach((key) => {
    properties.push(t.objectProperty(t.identifier(key), dynamicValue[key]));
  });
  return genInlineCode(t.objectExpression(properties)).code;
}

describe('Transform JSXElement', () => {
  describe('JSXExpressionContainer Types', () => {
    it('identifier', () => {
      const sourceCode = '<View foo={bar}>{ bar }</View>';
      const ast = parseExpression(sourceCode);
      const { dynamicValue } = _transform(ast, null, null, sourceCode);
      const code = genInlineCode(ast).code;
      expect(code).toEqual('<View foo="{{bar}}">{{ bar }}</View>');
      expect(genDynamicAttrs(dynamicValue)).toEqual('{ bar: bar }');
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
      const { dynamicValue } = _transform(ast, null, null, sourceCode);

      expect(genInlineCode(ast).code).toEqual('<View bool="{{true}}" str=\'string\' num="{{8}}" nil="{{null}}" regexp="{{_d0}}" tpl="hello world {{exp}}">string8{{ _d2 }}</View>');

      expect(genDynamicAttrs(dynamicValue)).toEqual('{ _d0: /a-z/, exp: exp, _d2: /a-z/ }');
    });

    it('should handle expression types', () => {
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
      const { dynamicValue, dynamicEvent } = _transform(ast, null, null, sourceCode);

      expect(genDynamicAttrs(dynamicValue)).toEqual('{ _d0: this.props.foo, _d1: this.state.bar, _d2: foo.bar.c, _d3: fn(), _d4: foo.method(), _d5: a() ? 1 : 2, _d6: ~a, _d7: new Foo(), _d8: delete foo.bar, _d9: typeof aaa, _d10: { ...{ a: 1 } } }');

      expect(genDynamicAttrs(dynamicEvent)).toEqual('{ _e0: event => { console.log(event); }, _e1: event => console.log(event), _e2: function (event) { console.log(event); } }');

      expect(genInlineCode(ast).code).toEqual('<View onFn1="_e0" onFn2="_e1" onFn3="_e2" prop="{{_d0}}" state="{{_d1}}" member="{{_d2}}" call1="{{_d3}}" call2="{{_d4}}" conditional="{{a ? 1 : 2}}" conditionalComplex="{{_d5}}" compare="{{a >= 1}}" math="{{a - 1}}" bitwise="{{_d6}}" logical="{{a || b}}" stringOp="{{\'a\' + c}}" comma="{{a, c}}" inst="{{_d7}}" delete="{{_d8}}" type="{{_d9}}" relation="{{\'a\' in b}}" group="{{a + 1}}" spread="{{_d10}}" />');
    });

    it('unsupported', () => {
      expect(() => {
        _transform(parseExpression('<View assign={a = 1} />'));
      }).toThrowError();
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
      const { dynamicEvent } = _transform(ast);
      expect(genDynamicAttrs(dynamicEvent)).toEqual('{ _e0: this.handleClick }');
      expect(genInlineCode(ast).code).toEqual('<View onClick="_e0" />');
    });

    it('prop methods', () => {
      const ast = parseExpression(`
        <View 
          onClick={props.onClick}
        />
      `);
      const { dynamicEvent } = _transform(ast);

      expect(genInlineCode(ast).code).toEqual('<View onClick="_e0" />');
      expect(genDynamicAttrs(dynamicEvent)).toEqual('{ _e0: props.onClick }');
    });

    it('bind methods', () => {
      const ast = parseExpression(`
        <View 
          onClick={onClick.bind(this, { a: 1 })}
          onKeyPress={this.handleClick.bind(this, 'hello')}
        />
      `);
      const { dynamicEvent } = _transform(ast);

      expect(genInlineCode(ast).code).toEqual('<View onClick="_e0" onKeyPress="_e1" data-arg-context="this" data-arg-0="{{ a: 1 }}" data-arg-context="this" data-arg-0="{{\'hello\'}}" />');
      expect(genDynamicAttrs(dynamicEvent)).toEqual('{ _e0: onClick, _e1: this.handleClick }');
    });

    it('skip list', () => {
      const sourceCode = `<View a:for="{{arr}}" a:for-item="_item" a:for-index="_index">
        <Text>{{ _item }} {{ _index }}</Text>
      </View>`;
      const ast = parseExpression(sourceCode);
      traverse(ast, {
        JSXExpressionContainer(p) {
          p.node.__transformed = true;
        }
      });
      const { dynamicValue } = _transform(ast, null, null, sourceCode);
      expect(genDynamicAttrs(dynamicValue)).toEqual('{}');
    });
  });

  describe('element', () => {
    it('should handle identifier', () => {
      const ast = parseExpression('<View>{foo}</View>');
      const { dynamicValue } = _transform(ast);
      const code = genInlineCode(ast).code;
      expect(code).toEqual('<View>{{ foo }}</View>');
      expect(genDynamicAttrs(dynamicValue)).toEqual('{ foo: foo }');
    });

    it('should handle literial types', () => {
      const sourceCode = `
        <View>
          {'string'}
          {8}
          {undefined}
          {null}
          {/a-z/}
          {{ a: 1 }}
          {[0, 1, 2]}
        </View>
      `;
      const ast = parseExpression(sourceCode);
      const { dynamicValue } = _transform(ast, null, null, sourceCode);

      expect(genInlineCode(ast).code).toEqual(`<View>
          string
          8
          
          
          {{ _d0 }}
          {{ _d1 }}
          {{ _d2 }}
        </View>`);
      expect(genDynamicAttrs(dynamicValue)).toEqual('{ _d0: /a-z/, _d1: { a: 1 }, _d2: [0, 1, 2] }');
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
      const { dynamicValue } = _transform(ast, null, null, sourceCode);

      expect(genInlineCode(ast).code).toEqual(`<View>
        {{ _d0 }}
        {{ _d1 }}
        {{ _d2 }}
        {{ _d3 }}
        {{ _d4 }}
        {{ a ? 1 : 2 }}
        {{ a >= 1 }}
        {{ a - 1 }}
        {{ _d5 }}
        {{ a || b }}
        {{ 'a' + c }}
        {{ a, c }}
        {{ _d6 }}
        {{ _d7 }}
        {{ _d8 }}
        {{ 'a' in b }}
        {{ a + 1 }}
        {{ _d9 }}
      </View>`);

      expect(genDynamicAttrs(dynamicValue)).toEqual('{ _d0: this.props.foo, _d1: this.state.bar, _d2: foo.bar.c, _d3: fn(), _d4: foo.method(), _d5: ~a, _d6: new Foo(), _d7: delete foo.bar, _d8: typeof aaa, _d9: { ...{ a: 1 } } }');
    });

    it('should handle text', () => {
      const sourceCode = '<Text style={styles.name}>{data && data.itemTitle ? data.itemTitle : \'\'}</Text>';
      const ast = parseExpression(sourceCode);
      const { dynamicValue } = _transform(ast, null, null, sourceCode);
      expect(genInlineCode(ast).code).toEqual('<Text style="{{_d0}}">{{ data && data.itemTitle ? data.itemTitle : \'\' }}</Text>');
      expect(genDynamicAttrs(dynamicValue)).toEqual('{ _d0: styles.name }');
    });

    it('unsupported', () => {
      expect(() => {
        _transform(parseExpression('<View>{a = 1}</View>'));
      }).toThrowError();
    });
  });
});
