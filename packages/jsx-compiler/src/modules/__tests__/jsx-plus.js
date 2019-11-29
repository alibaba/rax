const {
  _transformCondition,
  _transformList,
  _transformClass,
  _transformFragment,
  _transformSlotDirective
} = require('../jsx-plus');
const { parseExpression } = require('../../parser');
const genExpression = require('../../codegen/genExpression');
const adapter = require('../../adapter').ali;

describe('Directives', () => {
  describe('list', () => {
    it('simple', () => {
      const code = `
      <View>
        <View x-for={val in array}>{val}</View>
      </View>
    `;
      const ast = parseExpression(code);
      _transformList(ast, code, adapter);
      expect(genExpression(ast))
        .toEqual(`<View>
        <block a:for={array.map((val, index) => {
    return {
      val: val,
      index: index
    };
  })} a:for-item="val" a:for-index="index"><View>{val}</View></block>
      </View>`);
    });

    it('nested', () => {
      const code = `
      <View>
        <View x-for={item in array}>
          <View x-for={item2 in item}>{item2}
        </View>
      </View>
</View>
    `;
      const ast = parseExpression(code);
      _transformList(ast, code, adapter);
      expect(genExpression(ast))
        .toEqual(`<View>
        <block a:for={array.map((item, index) => {
    return {
      item: item.map((item2, index0) => {
        return {
          item2: item2,
          index0: index0
        };
      }),
      index: index
    };
  })} a:for-item="item" a:for-index="index"><View>
          <block a:for={item} a:for-item="item2" a:for-index="index0"><View>{item2}
        </View></block>
      </View></block>
</View>`);
    });

    it('difficult nested', () => {
      const code = `
      <View className="rxpi-coupon">
        <View
          x-for={(row, rowIndex) in testList}
          className="rxpi-coupon-row"
          key={'test_' + rowIndex}
        >
          <View x-for={(col, colIndex) in row} >
            <Text key={colIndex}>{colIndex}</Text>
          </View>
        </View>
      </View>
    `;
      const ast = parseExpression(code);
      _transformList(ast, code, adapter);
      expect(genExpression(ast))
        .toEqual(`<View className="rxpi-coupon">
        <block key={'test_' + rowIndex} a:for={testList.map((row, rowIndex) => {
    return {
      row: row.map((col, colIndex) => {
        return {
          col: col,
          colIndex: colIndex
        };
      }),
      rowIndex: rowIndex
    };
  })} a:for-item="row" a:for-index="rowIndex"><View className="rxpi-coupon-row">
          <block a:for={row} a:for-item="col" a:for-index="colIndex"><View>
            <Text key={colIndex}>{colIndex}</Text>
          </View></block>
        </View></block>
      </View>`);
    });
  });

  describe('condition', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <View x-if={value}></View>
      `);
      _transformCondition(ast, adapter);
      expect(genExpression(ast)).toEqual('<View a:if={value}></View>');
    });
  });

  describe('fragment', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <Fragment foo="bar"></Fragment>
      `);
      _transformFragment(ast);
      expect(genExpression(ast)).toEqual('<block foo="bar"></block>');
    });
  });

  describe('class', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <View x-class={classNames}></View>
      `);
      _transformClass(ast, adapter);
      expect(genExpression(ast)).toEqual('<View className={__classnames__(classNames)}></View>');
    });

    it('combine', () => {
      const ast = parseExpression(`
        <View className="home" x-class={classNames}></View>
      `);
      _transformClass(ast, adapter);
      expect(genExpression(ast)).toEqual('<View className={"home" + " " + __classnames__(classNames)}></View>');
    });
  });

  describe('slot', () => {
    it('should transform ali slot', () => {
      const code = '<View x-slot:item="props">{props.text}</View>';
      const ast = parseExpression(code);
      _transformSlotDirective(ast, adapter);
      expect(genExpression(ast)).toEqual('<View slot="item" slot-scope="props">{props.text}</View>');
    });
  });
});
