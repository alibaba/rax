const { transformJSX } = require('../transformJSX');
const { resolve } = require('path');
const stripIndent = require('./__modules__/stripIndent');

const sourcePath = resolve(__dirname);

describe('transfrom event handle', () => {
  it('should transform a simple click event.', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        handleClick(evt) {
          // do sth.
        }
      
        render() {
          return (
            <view onTap={this.handleClick}>Click Me!</view>
          );
        }
      }`;
    const expectedTemplate = '<view onTap="handleClick">Click Me!</view>';
    const expectedScript = `
      import { createComponent as __create_component__ } from "/__helpers/component";

      var __class_def__ = class {
        handleClick(evt) {// do sth.
        }

      };

      Component(__create_component__(__class_def__));`;
    const { template, jsCode } = transformJSX(originJSX, {
      filePath: sourcePath
    });
    expect(template).toEqual(stripIndent(expectedTemplate));
    expect(jsCode).toEqual(stripIndent(expectedScript));
  });
});
