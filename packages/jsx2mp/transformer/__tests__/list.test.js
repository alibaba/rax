const { transformJSX } = require('../transformJSX');
const { resolve } = require('path');
const stripIndent = require('./stripIndent');

const sourcePath = resolve(__dirname);

describe('transfrom list', () => {
  const transformJSXOptions = {
    filePath: sourcePath
  };
  it('should render a simple list.', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        render() {
          const { arr } = this.state;
          return (
            <view>
              {arr.map((n) => {
                return (<view>{n}</view>);
              })}
              {arr.map((n) => (<view>{n}</view>))}
            </view>
          );
        }
      }`;
    const expectedTemplate = `
      <view>
        <block a:for="{{arr}}" a:for-item="n" a:for-index="index">
          <view>{{n}}</view>
        </block>

        <block a:for="{{arr}}" a:for-item="n" a:for-index="index">
          <view>{{n}}</view>
        </block>
      </view>  
      `;
    const { template } = transformJSX(originJSX, transformJSXOptions);
    expect(template).toEqual(stripIndent(expectedTemplate));
  });

  it('should transform nested list', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        render() {
          const { outsideArr, insideArr } = this.state;
          return (
            <view>
              {
                outsideArr.map(outsideItem => {
                  return <view>
                    {insideArr.map(insideItem => <text>{insideItem}</text>)}
                  </view>
                })
              }
            </view>
          );
        }
      }`;
    const expectedTemplate = `
      <view>
        <block a:for="{{outsideArr}}" a:for-item="outsideItem" a:for-index="index">
          <view>
            <block a:for="{{insideArr}}" a:for-item="insideItem" a:for-index="index">
              <text>{{insideItem}}</text>
            </block>
          </view>
        </block>
      </view>`;
    const { template } = transformJSX(originJSX, transformJSXOptions);
    expect(template).toEqual(stripIndent(expectedTemplate));
  });

  it('should render a condition with list', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        render() {
          const { outsideArr, insideArr } = this.state;
          return (
            <view>
              {
                arr.length > 2 ? arr.map(item => <text>{item}</text>) : <text>Nothing!</text>
              }
            </view>
          );
        }
      }`;
    const expectedTemplate = `
      <view>
        <block a:if="{{arr.length > 2}}">
          <block a:for="{{arr}}" a:for-item="item" a:for-index="index">
            <text>{{item}}</text>
          </block>
        </block>
        <block a:else>
          <text>Nothing!</text>
        </block>
      </view>`;
    const { template } = transformJSX(originJSX, transformJSXOptions);
    expect(template).toEqual(stripIndent(expectedTemplate));
  });

  it('should render a condition with consequent is a list and alternate is null', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        render() {
          const { outsideArr, insideArr } = this.state;
          return (
            <view>
              {
                arr.length > 2 ? arr.map(item => <text>{item}</text>) : null
              }
            </view>
          );
        }
      }`;
    const expectedTemplate = `
      <view>
        <block a:if="{{arr.length > 2}}">
          <block a:for="{{arr}}" a:for-item="item" a:for-index="index">
            <text>{{item}}</text>
          </block>
        </block>
      </view>`;
    const { template } = transformJSX(originJSX, transformJSXOptions);
    expect(template).toEqual(stripIndent(expectedTemplate));
  });

  it('should render a condition with consequent is null and alternate is a list', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        render() {
          const { outsideArr, insideArr } = this.state;
          return (
            <view>
              {
                arr.length > 2 ? null : arr.map(item => <text>{item}</text>)
              }
            </view>
          );
        }
      }`;
    const expectedTemplate = `
      <view>
        <block a:if="{{arr.length > 2}}">

        </block>
        <block a:else>
          <block a:for="{{arr}}" a:for-item="item" a:for-index="index">
            <text>{{item}}</text>
          </block>
        </block>
      </view>`;
    const { template } = transformJSX(originJSX, transformJSXOptions);
    expect(template).toEqual(stripIndent(expectedTemplate));
  });
});
