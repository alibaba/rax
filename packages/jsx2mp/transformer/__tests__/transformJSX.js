const { readdirSync, readFileSync } = require('fs-extra');
const { resolve } = require('path');
const { transformJSX } = require('../transformJSX');


const ORIGIN_JSX = 'origin.jsx';
const EXPECTED_TEMPLATE = 'expected.axml';
const EXPECTED_JS = 'expected.js';

const fixturesDirPath = resolve(__dirname, 'fixtures');
const fixtures = readdirSync(fixturesDirPath);

describe('transformJSX', () => {
  for (let i = 0, l = fixtures.length; i < l; i ++) {
    it(fixtures[i], () => {
      const originPath = resolve(fixturesDirPath, fixtures[i], ORIGIN_JSX);
      const expectedTemplatePath = resolve(fixturesDirPath, fixtures[i], EXPECTED_TEMPLATE);
      const expectedJSPath = resolve(fixturesDirPath, fixtures[i], EXPECTED_JS);

      const { template, jsCode } = transformJSX(getFileContent(originPath), { filePath: originPath });

      expect(template).toEqual(getFileContent(expectedTemplatePath));
      expect(jsCode).toEqual(getFileContent(expectedJSPath));
    });
  }

  it('should throw error with JSX inline method ref.', () => {
    expect(() => {
      transformJSX(`
        import { Component } from 'rax';
        export default class extends Component {
          render() {
            return (
              <view>
                {foo.map(this.renderItem)
              </view>
            );
          }
        }
      `);
    }).toThrowError();
  });

  it('should throw error with JSX + IIFE', () => {
    expect(() => {
      transformJSX(`
        import { Component } from 'rax';
        export default class extends Component {
          render() {
            return (
              <view>
                {(function(fn) {fn()})(this.renderItem)
              </view>
            );
          }
        }
      `);
    }).toThrowError();
  });
});

/**
 * Get file content by path.
 * @param path {String} File path.
 */
function getFileContent(path) {
  return readFileSync(path, 'utf-8').trim();
}
