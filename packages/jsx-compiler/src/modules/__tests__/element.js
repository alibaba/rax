const t = require('@babel/types');
const { _transform } = require('../element');
const { parseExpression } = require('../../parser');
const genCode = require('../../codegen/genCode');

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
  describe('attrs', () => {
    it('should handle identifier', () => {
      const ast = parseExpression('<View foo={bar} />');
      const dynamicValue = _transform(ast);
      const code = genInlineCode(ast).code;
      expect(code).toEqual('<View foo="{{bar}}" />');
      expect(dynamicValue).toEqual({});
    });

    it('should handle literial types', () => {
      const ast = parseExpression(`
      <View 
        str={'string'}
        num={8}
        undef={undefined}
        nil={null}
        regexp={/a-z/}
        fn={(event) => { console.log(event); }}
        obj={{ a: 1 }}
        arr={[0, 1, 2]}
      />
    `);
      const dynamicValue = _transform(ast);

      expect(genInlineCode(ast).code).toEqual('<View str="string" num="{{8}}" undef="{{undefined}}" nil="{{null}}" regexp="{{_d0}}" fn="_e0" obj="{{_d1}}" arr="{{_d2}}" />');

      expect(genDynamicAttrs(dynamicValue)).toMatchSnapshot();
    });

    it('should handle expressions', () => {
      const ast = parseExpression(`
      <View 
        fn1={(event) => { console.log(event) }}
        fn2={(event) => console.log(event)}
        fn3={function(event) {console.log(event)}}
        prop={this.props.foo}
        state={this.state.bar}
        member={foo.bar.c}
        call1={fn()}
        call2={foo.method()}
        unary={a ? 1 : 2}
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
    `);
      const dynamicValue = _transform(ast);

      expect(genInlineCode(ast).code).toEqual('<View fn1="_e0" fn2="_e1" fn3="_e2" prop="{{foo}}" state="{{bar}}" member="{{foo.bar.c}}" call1="{{_d0}}" call2="{{_d1}}" unary="{{_d2}}" compare="{{a >= 1}}" math="{{a - 1}}" bitwise="{{_d3}}" logical="{{a || b}}" stringOp="{{\'a\' + c}}" comma="{{c}}" inst="{{_d4}}" delete="{{_d5}}" type="{{_d6}}" relation="{{\'a\' in b}}" group="{{a + 1}}" spread="{{_d7}}" />');

      expect(genDynamicAttrs(dynamicValue)).toMatchSnapshot();
    });

    it('unsupported', () => {
      expect(() => {
        _transform(parseExpression('<View assign={a = 1} />'));
      }).toThrowError();
    });

    it('eventHandler', () => {
      const ast = parseExpression(`
      <View 
        onClick={this.handleClick}
      />
    `);
      _transform(ast);

      expect(genInlineCode(ast).code).toEqual('<View onClick="handleClick" />');
    });
  });

  describe('element', () => {
    it('should handle identifier', () => {
      const ast = parseExpression('<View>{foo}</View>');
      const dynamicValue = _transform(ast);
      const code = genInlineCode(ast).code;
      expect(code).toEqual('<View>{{ foo }}</View>');
      expect(dynamicValue).toEqual({});
    });

    it('should handle literial types', () => {
      const ast = parseExpression(`
        <View>
          {'string'}
          {8}
          {undefined}
          {null}
          {/a-z/}
          {(event) => { console.log(event); }}
          {{ a: 1 }}
          {[0, 1, 2]}
        </View>
      `);
      const dynamicValue = _transform(ast);

      expect(genInlineCode(ast).code).toEqual(`<View>
          string
          {{ 8 }}
          
          
          {{ _d0 }}
          {{ _e0 }}
          {{ a: 1 }}
          {{ _d1 }}
        </View>`);
      expect(genDynamicAttrs(dynamicValue)).toMatchSnapshot();
    });

    it('should handle expressions', () => {
      const ast = parseExpression(`<View>
        {(event) => { console.log(event) }}
        {(event) => console.log(event)}
        {function(event) {console.log(event)}}
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
      </View>`);
      const dynamicValue = _transform(ast);

      expect(genInlineCode(ast).code).toEqual(`<View>
        {{ _e0 }}
        {{ _e1 }}
        {{ _e2 }}
        {{ foo }}
        {{ bar }}
        {{ foo.bar.c }}
        {{ _d0 }}
        {{ _d1 }}
        {{ _d2 }}
        {{ a >= 1 }}
        {{ a - 1 }}
        {{ _d3 }}
        {{ a || b }}
        {{ 'a' + c }}
        {{ c }}
        {{ _d4 }}
        {{ _d5 }}
        {{ _d6 }}
        {{ 'a' in b }}
        {{ a + 1 }}
        {{ ...{ a: 1 } }}
      </View>`);

      expect(genDynamicAttrs(dynamicValue)).toMatchSnapshot();
    });

    it('unsupported', () => {
      expect(() => {
        _transform(parseExpression('<View>{a = 1}</View>'));
      }).toThrowError();
    });
  });
});
