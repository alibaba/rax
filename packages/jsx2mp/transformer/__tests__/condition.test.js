const { transformJSX } = require('../transformJSX');
const { resolve } = require('path');
const stripIndent = require('./stripIndent');

const sourcePath = resolve(__dirname);

describe('transform condition expression', () => {
  it('should transform condition expression to a:if', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        state = {
          show: false,
        }
      
        render() {
          const { show } = this.state;
          return (
            <view>
              { show ? <text>Show!</text> : <text>Not show!</text> }
            </view>
          );
        }
      }`;
    const expectedTemplate = `
      <view>
        <block a:if="{{show}}">
          <text>Show!</text>
        </block>
        <block a:else>
          <text>Not show!</text>
        </block>
      </view>
    `;
    const { template } = transformJSX(originJSX, {
      filePath: sourcePath
    });
    expect(template).toEqual(stripIndent(expectedTemplate));
  });

  it('should transform nested condition', () => {
    const originJSX = `
    import { createElement, Component } from 'rax';

    export default class extends Component {
      state = {
        a: true,
        b: false
      }
    
      render() {
        const { a, b } = this.state;
        return (
          <view> { a ? b ? <text>'b true'</text> : <text>'b false'</text> : <text>'a false'</text>} </view>
        );
      }
    }`;
    const expectedTemplate = `
      <view>
        <block a:if="{{a}}">
          <block a:if="{{b}}">
            <text>'b true'</text>
          </block>
          <block a:else>
            <text>'b false'</text>
          </block>
        </block>
        <block a:else>
          <text>'a false'</text>
        </block>
      </view>
    `;
    const { template } = transformJSX(originJSX, {
      filePath: sourcePath
    });
    expect(template).toEqual(stripIndent(expectedTemplate));
  });
});
