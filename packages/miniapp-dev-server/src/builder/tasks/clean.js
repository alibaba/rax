const rimraf = require('rimraf');

module.exports = function clean(dir) {
  return (done) => {
    rimraf.sync(dir);
    done();
  };
};