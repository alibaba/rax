module.exports = function(actual, expected) {
  expect(actual).toMatch('// {"framework" : "Rax"}');
};
