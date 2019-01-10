const { mkdirpSync } = require('fs-extra');

module.exports = function ensureDir(dir) {
  return (done) => {
    mkdirpSync(dir);
    done();
  };
};
