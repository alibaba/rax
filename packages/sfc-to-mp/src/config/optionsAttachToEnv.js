/**
 * attach argv into process.env
 *
 * @param {object} args commander
 */
const decamelize = require('decamelize');
const camelcase = require('camelcase');

module.exports = (program) => {
  const envWhiteList = program.options.map((option) => {
    // --foo-bar => fooBar
    return camelcase(option.long);
  });

  envWhiteList.forEach((key) => {
    if (key in program) {
      // fooBar => FOO_BAR
      const k = decamelize(key).toUpperCase();
      process.env[k] = program[key];
    }
  });
};
