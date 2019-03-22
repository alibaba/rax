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

      const { template, jsCode } = transformJSX(getFileContent(originPath));

      expect(template).toEqual(getFileContent(expectedTemplatePath));
      expect(jsCode).toEqual(getFileContent(expectedJSPath));
    });
  }
});

/**
 * Get file content by path.
 * @param path {String} File path.
 */
function getFileContent(path) {
  return readFileSync(path, 'utf-8').trim();
}
