const updateNotifier = require('update-notifier');

const pkgVersion = [
  {
    name: 'jsx2mp-cli',
    version: '0.2.7'
  },
  {
    name: 'jsx2mp-runtime',
    version: '0.3.7'
  },
  {
    name: 'jsx2mp-loader',
    version: '0.2.8'
  },
  {
    name: 'jsx-compiler',
    version: '0.3.8'
  }
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
