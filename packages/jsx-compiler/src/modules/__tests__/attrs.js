const t = require('@babel/types');
const { _transformAttrs } = require('../attrs');
const { parseExpression } = require('../../parser');
const genCode = require('../../codegen/genCode');

function genDynamicAttrs(dynamicValue) {
  const properties = [];
  Object.keys(dynamicValue).forEach((key) => {
    properties.push(t.objectProperty(t.identifier(key), dynamicValue[key]));
  });
  return genCode(t.objectExpression(properties)).code;
}

describe('template attrs', () => {
  it('should handle identifier', () => {
    const ast = parseExpression('<View foo={bar} />');
    const dynamicValue = _transformAttrs(ast);
    const code = genCode(ast).code;
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
    const dynamicValue = _transformAttrs(ast);

    expect(genCode(ast).code).toEqual('<View str="string" num="{{8}}" undef="{{undefined}}" nil="{{null}}" regexp="{{_dynamicVal0}}" fn="_event0" obj="{{_dynamicVal1}}" arr="{{_dynamicVal2}}" />');

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
    const dynamicValue = _transformAttrs(ast);

    expect(genCode(ast).code).toEqual('<View fn1="_event0" fn2="_event1" fn3="_event2" prop="{{foo}}" state="{{bar}}" member="{{foo.bar.c}}" call1="{{_dynamicVal0}}" call2="{{_dynamicVal1}}" unary="{{_dynamicVal2}}" compare="{{a >= 1}}" math="{{a - 1}}" bitwise="{{_dynamicVal3}}" logical="{{a || b}}" stringOp="{{\'a\' + c}}" comma="{{c}}" inst="{{_dynamicVal4}}" delete="{{_dynamicVal5}}" type="{{_dynamicVal6}}" relation="{{\'a\' in b}}" group="{{a + 1}}" spread="{{_dynamicVal7}}" />');

    expect(genDynamicAttrs(dynamicValue)).toMatchSnapshot();
  });

  it('unsupported', () => {
    expect(() => {
      _transformAttrs(parseExpression('<View assign={a = 1} />'));
    }).toThrowError();
  });
});
