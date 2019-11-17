const updateNotifier = require('update-notifier');

const jsx2mpCliPkg = require('./package.json');
const jsx2mpLoaderPkg = require('jsx2mp-loader/package.json');
// eslint-disable-next-line
const jsx2mpCompilerPkg = require('jsx-compiler/package.json');
const jsx2mpRuntimePkg = require('jsx2mp-runtime/package.json');

const pkgVersion = [
  jsx2mpCliPkg,
  jsx2mpLoaderPkg,
  jsx2mpCompilerPkg,
  jsx2mpRuntimePkg
];

let needUpdate = false;

pkgVersion.forEach(pkg => {
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 7 // 1 week
  });
  if (notifier.update) {
    needUpdate = true;
  }
});

module.exports = needUpdate;
