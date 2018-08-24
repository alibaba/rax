const mkdirp = require('mkdirp');

module.exports = function ensureDir(dir) {
  return (done) => {
    mkdirp.sync(dir);
    done();
  };
};
