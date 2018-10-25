const camelcase = require('camelcase');
const { setOption } = require('./cliOptions');

module.exports = function(program) {
  program.options.map(option => {
    const { long } = option;
    // --foo-bar => fooBar
    const optionKey = camelcase(option.long);
    return setOption(long.slice(2), program[optionKey]);
  });
};
