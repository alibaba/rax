const { transformJSX } = require('../transformJSX');
const { resolve } = require('path');
const stripIndent = require('./stripIndent');

const sourcePath = resolve(__dirname);

describe('transfrom simple example', () => {
  it('should render a view with a bind data.', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        state = {
          value: 'world'
        };
      
        render() {
          return (
            <view>Hello {this.state.value}</view>
          );
        }
      }`;
    const expectedTemplate = '<view>Hello {{value}}</view>';
    const expectedScript = `
      import { createComponent as __create_component__ } from "/__helpers/component";
      import { createElement, Component as __rax_component__ } from 'rax';
      
      var __class_def__ = class extends __rax_component__ {
        state = {
          value: 'world'
        };
      };
      
      Component(__create_component__(__class_def__));`;
    const { template, jsCode } = transformJSX(originJSX, {
      filePath: sourcePath
    });
    expect(template).toEqual(stripIndent(expectedTemplate));
    expect(jsCode).toEqual(stripIndent(expectedScript));
  });
});
