const transform = require('../');
const { resolve } = require('path');
const stripIndent = require('./__modules__/stripIndent');

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
      import { createComponent as __create_component__ } from "jsx2mp-runtime";
      
      var __class_def__ = class {
        state = {
          value: 'world'
        };
      };
      
      Component(__create_component__(__class_def__));`;
    const { template, jsCode } = transform(originJSX, {
      filePath: sourcePath
    });
    expect(template).toEqual(stripIndent(expectedTemplate));
    expect(jsCode).toEqual(stripIndent(expectedScript));
  });

  it('should render pure number', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        render() {
          return 1;
        }
      }`;
    const expectedTemplate = 1;
    const { template } = transform(originJSX, {
      filePath: sourcePath
    });
    expect(template).toEqual(stripIndent(expectedTemplate));
  });

  it('should render pure string', () => {
    const originJSX = `
      import { createElement, Component } from 'rax';

      export default class extends Component {
        render() {
          return 'Hello World!';
        }
      }`;
    const expectedTemplate = 'Hello World!';
    let { template } = transform(originJSX, {
      filePath: sourcePath
    });
    if (typeof template === 'string') template = String(template);
    expect(template).toEqual(stripIndent(expectedTemplate));
  });

  it('should render array', () => {
    const originJSX = `
      import { createElement, Component } from "rax";

      export default class extends Component {
        render() {
          return (
            [
              'Hello World!',
              <view>Hi!</view>
            ]
          )
        }
      }`;
    const expectedTemplate = `
      Hello World!
      <view>Hi!</view>
    `;
    const { template } = transform(originJSX, {
      filePath: sourcePath
    });
    expect(template).toEqual(stripIndent(expectedTemplate));
  });
});
