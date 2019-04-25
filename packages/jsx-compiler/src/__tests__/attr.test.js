const { transformJSX } = require('../transformJSX');
const { resolve } = require('path');
const stripIndent = require('./__modules__/stripIndent');

const sourcePath = resolve(__dirname);

describe('transform attribute', () => {
  it('should transform attribute', () => {
    const originJSX = `
      import { createElement, Component } from 'rax'; 
      export default class extends Component {
        render() {
          const { show, bar } = this.state;
          return (
            <view>
              <view foo="bar">string literial</view>
              <view foo={false}>boolean literial</view>
              <view foo={null}>null literial</view>
              <view foo={undefined}>undefined literial</view>
              <view foo={{ a: 1 }}>object literial</view>
              <view foo={bar}>id bind</view>
              <view foo={this.state.bar}>id bind</view>
              <view foo={bar > 10}>binary expression</view>
              <view foo={bar > 10 ? true : false}>binary expression</view>
              <view foo={bar()}>call expression</view>
            </view>
          );
        }
      }`;
    const expectedTemplate = `
      <view>
        <view foo="bar">string literial</view>

        <view foo="{{false}}">boolean literial</view>
      
        <view foo="{{null}}">null literial</view>
      
        <view foo="{{undefined}}">undefined literial</view>
      
        <view foo="{{ a: 1 }}">object literial</view>
      
        <view foo="{{bar}}">id bind</view>
      
        <view foo="{{bar}}">id bind</view>
      
        <view foo="{{bar > 10}}">binary expression</view>
      
        <view foo="{{bar > 10 ? true : false}}">binary expression</view>
      
        <view>call expression</view>
      </view>
    `;
    const { template } = transformJSX(originJSX, {
      filePath: sourcePath
    });
    expect(template).toEqual(stripIndent(expectedTemplate));
  });
});
