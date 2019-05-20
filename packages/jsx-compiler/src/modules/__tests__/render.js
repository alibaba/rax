const renderAttrPlugin = require('../render-plugins/render-attr-plugin');
const compile = require('../../index');
const parser = require('../../parser');
const chalk = require('chalk');
const generate = require('@babel/generator').default;

const DYNAMIC_EVENTS = 'DYNAMIC_EVENTS';
const STATE_DATA = 'STATE_DATA';
const CSS_STYLES = 'CSS_STYLES';

describe('render module', () => {
  it('render attr plugin test', () => {
    const code = `
      import { createElement, useState, Component } from 'rax';
      import View from 'rax-view';
      import Text from 'rax-text';
      
      export default class extends Component {
        render() {
          return <View>
            <Text className="bgImage">{this.state.bgImage}</Text>
            <Touchable className="touchAble" onPress={this.onPress}>点击跳转</Touchable>
          </View>;
        }
    }`;
    let parsed = parser.parse(code, { modules: [renderAttrPlugin] });
    // let genParsedCode = generate(parsed.ast).code;
    // expect(JSON.stringify(genParsedCode))
    //   .toEqual(
    //     '\"import { createElement, useState, Component } from 'rax';\\nimport View from 'rax-view';\\nimport Text from 'rax-text';\\nexport default class extends Component {\\n
    //  render() {\\n    return <View>\\n            <Text class=\\\"bgImage\\\">{{\\n          bgImage\\n        }}</Text>\\n            <Touchable class=\\\"touchAble\\\"
    // onTap={{\\n        onPress\\n      }}>点击跳转</Touchable>\\n          </View>;\\n  }\\n\\n}\"');
    expect(parsed[STATE_DATA]).toEqual({ 'bgImage': '', 'onPress': '' });
    expect(parsed[CSS_STYLES]).toEqual({ '.bgImage': 'Text', '.touchAble': 'Touchable' });
  });
});
