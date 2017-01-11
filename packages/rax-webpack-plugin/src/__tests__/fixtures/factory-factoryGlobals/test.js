import readFile from '../readFile';

module.exports = function(actualPath, filePath) {
  const actual = readFile(actualPath);
  const expected = readFile(filePath);

  expect(actual).toBe(expected);
  expect(actual).toMatch(/^module.exports = /);
};
