const build = require('./build');
const dev = require('./dev');

module.exports = ({ command, rootDir }, options = {}) => {
  if (command === 'dev') {
    dev(rootDir);
  }

  if (command === 'build') {
    build(rootDir);
  }
};
