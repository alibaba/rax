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
const quickAppAdapter = require('../../adapter').quickapp;

let count = 0;
let id = 0;

describe('Directives', () => {
  describe('list', () => {
    it('simple', () => {
      const code = `
      <View>
        <View x-for={val in array}>{val}</View>
      </View>
    `;
      const ast = parseExpression(code);
      _transformList({
        templateAST: ast
      }, code, adapter);
      const index = 'index' + count++;
      expect(genExpression(ast))
        .toEqual(`<View>
        <View a:for={array.map((val, ${index}) => {
    return {
      val: val,
      ${index}: ${index}
    };
  })} a:for-item="val" a:for-index="${index}">{{
      val.val
    }}</View>
      </View>`);
    });

    it('nested', () => {
      const code = `
      <View>
        <View x-for={item in array}>
          <View x-for={item2 in item}>{item2}</View>
      </View>
</View>
    `;
      const ast = parseExpression(code);
      _transformList({
        templateAST: ast
      }, code, adapter);
      const index1 = 'index' + count++;
      const index2 = 'index' + count++;
      expect(genExpression(ast))
        .toEqual(`<View>
        <View a:for={array.map((item, ${index1}) => {
    return {
      item: item.map((item2, ${index2}) => {
        return {
          item2: item2,
          ${index2}: ${index2}
        };
      }),
      ${index1}: ${index1}
    };
  })} a:for-item="item" a:for-index="${index1}">
          <View a:for={item} a:for-item="item2" a:for-index="${index2}">{{
        item2.item2
      }}</View>
      </View>
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
      _transformList({
        templateAST: ast
      }, code, adapter);
      const index1 = 'index' + count++;
      const index2 = 'index' + count++;
      expect(genExpression(ast))
        .toEqual(`<View className="rxpi-coupon">
        <View className="rxpi-coupon-row" key="{{row._d0}}" a:for={testList.map((row, ${index1}) => {
    return {
      row: row.map((col, ${index2}) => {
        return {
          col: col,
          ${index2}: ${index2}
        };
      }),
      ${index1}: ${index1},
      _d0: 'test_' + ${index1}
    };
  })} a:for-item="row" a:for-index="${index1}">
          <View a:for={row} a:for-item="col" a:for-index="${index2}">
            <Text key="{{col.${index2}}}">{{
          col.${index2}
        }}</Text>
          </View>
        </View>
      </View>`);
    });

    it('use format function in x-for', () => {
      const code = `
      <View>
        <View x-for={val in array}>{format(val)}</View>
      </View>
    `;
      const ast = parseExpression(code);
      _transformList({
        templateAST: ast
      }, code, adapter);
      const index = 'index' + count++;
      expect(genExpression(ast))
        .toEqual(`<View>
        <View a:for={array.map((val, ${index}) => {
    return {
      val: val,
      ${index}: ${index},
      _d0: format(val)
    };
  })} a:for-item="val" a:for-index="${index}">{{
      val._d0
    }}</View>
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
      expect(genExpression(ast)).toEqual('<View className={`home${" "}${__classnames__(classNames)}`}></View>');
    });
  });

  describe('slot', () => {
    it('should transform ali slot', () => {
      const code = '<View x-slot:item="props">{props.text}</View>';
      const ast = parseExpression(code);
      _transformSlotDirective(ast, adapter);
      expect(genExpression(ast)).toEqual('<View slot="item" slot-scope="props">{props.text}</View>');
    });

    it('should add default scope name', () => {
      const code = '<View x-slot:item>{props.text}</View>';
      const ast = parseExpression(code);
      _transformSlotDirective(ast, adapter);
      expect(genExpression(ast)).toEqual('<View slot="item" slot-scope="__defaultScopeName">{props.text}</View>');
    });
  });

  describe('ref', () => {
    it('should transform ref in x-for', () => {
      const code = `<View>
        <View x-for={(item, index) in data} ref={refs[index]}>test</View>
      </View>`;
      const ast = parseExpression(code);
      _transformList({
        templateAST: ast
      }, code, adapter);
      const index = 'index' + count++;
      expect(genExpression(ast)).toEqual(`<View>
        <View ref="{{item._d0}}" id="id_${id}{{${index}}}" a:for={data.map((item, ${index}) => {
    this._registerRefs([{
      "name": "${id}" + ${index},
      "method": refs[${index}],
      "type": "native",
      "id": "id_${id}" + ${index}
    }]);

    return {
      item: item,
      ${index}: ${index},
      _d0: "${id}" + ${index}
    };
  })} a:for-item="item" a:for-index="${index}">test</View>
      </View>`);
      id++;
    });
  });

  it('should transform ref in nested x-for', () => {
    const code = `<View>
        <View x-for={(item, index) in data}>
            <View x-for={(item, idx) in item.list} ref={refs[idx]}>test</View>
        </View>
      </View>`;
    const ast = parseExpression(code);
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index1 = 'index' + count++;
    const index2 = 'index' + count++;
    expect(genExpression(ast)).toEqual(`<View>
        <View a:for={data.map((item, ${index1}) => {
    return {
      item: { ...item,
        list: item.list.map((item, ${index2}) => {
          this._registerRefs([{
            "name": "${id}" + ${index2},
            "method": refs[${index2}],
            "type": "native",
            "id": "id_${id}" + ${index2}
          }]);

          return {
            item: item,
            ${index2}: ${index2},
            _d0: "${id}" + ${index2}
          };
        })
      },
      ${index1}: ${index1}
    };
  })} a:for-item="item" a:for-index="${index1}">
            <View ref="{{item._d0}}" id="id_${id}{{${index2}}}" a:for={item.list} a:for-item="item" a:for-index="${index2}">test</View>
        </View>
      </View>`);
    id++;
  });
});

// quickApp
describe('Directives in quickApp', () => {
  describe('list in quickApp', () => {
    it('simple', () => {
      const code = `
      <View>
        <View x-for={val in array}>{val}</View>
      </View>
    `;
      const ast = parseExpression(code);
      _transformList({
        templateAST: ast
      }, code, quickAppAdapter);
      expect(genExpression(ast))
        .toEqual(`<View>
        <View for={array.map((val, index9) => {
    return {
      val: val,
      index9: index9
    };
  })} a:for-item="val" a:for-index="index9">{{
      val.val
    }}</View>
      </View>`);
    });

    it('nested in quickApp', () => {
      const code = `
      <View>
        <View x-for={item in array}>
          <View x-for={item2 in item}>{item2}
        </View>
      </View>
</View>
    `;
      const ast = parseExpression(code);
      _transformList({
        templateAST: ast
      }, code, quickAppAdapter);
      expect(genExpression(ast))
        .toEqual(`<View>
        <View for={array.map((item, index10) => {
    return {
      item: item.map((item2, index11) => {
        return {
          item2: item2,
          index11: index11
        };
      }),
      index10: index10
    };
  })} a:for-item="item" a:for-index="index10">
          <View for={item} a:for-item="item2" a:for-index="index11">{{
        item2.item2
      }}
        </View>
      </View>
</View>`);
    });
  });

  describe('slot in quickApp', () => {
    it('should transform ali slot', () => {
      const code = '<View x-slot:item="props">{props.text}</View>';
      const ast = parseExpression(code);
      _transformSlotDirective(ast, code, quickAppAdapter);
      expect(genExpression(ast)).toEqual('<View slot="item">{props.text}</View>');
    });
  });
});