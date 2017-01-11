import {readFileOrEmpty} from '../util';

module.exports = function(actualPath, filePath) {
  const actual = readFileOrEmpty(actualPath);
  const expected = readFileOrEmpty(filePath);

  expect(actual).toBe(expected);
  expect(actual).toMatch(/^module\.exports = /);
};
