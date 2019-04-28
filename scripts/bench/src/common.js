const path = require('path');
const fs = require('fs');
const os = require('os');

function loadFrameworkVersionInformation(frameworks) {
  const results = {};

  frameworks.map((framework) => {
    results[framework] = {
      name: framework
    };

    if (framework === 'rax-local') {
      results[framework].version = 'local';
      return;
    }

    const frameworkPath = path.resolve(__dirname, `../frameworks/${framework}`);
    const packageJSONPath = path.resolve(frameworkPath, 'package.json');
    const packageLockJSONPath = path.resolve(frameworkPath, 'package-lock.json');

    if (fs.existsSync(packageLockJSONPath)) {
      const packageLock = JSON.parse(fs.readFileSync(packageLockJSONPath, 'utf8'));

      if (packageLock.dependencies[framework]) {
        results[framework].version = packageLock.dependencies[framework].version;
      } else if (fs.existsSync(packageJSONPath)) {
        const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'));

        if (packageJSON.dependencies && packageJSON.dependencies[framework]) {
          results[framework].version = packageJSON.dependencies[framework];
        }
      }
    }
  });

  return results;
}

function getOSInformation() {
  return {
    platform: os.platform() + ' ' + os.release(),
    cpu: os.cpus()[0].model,
    'system memory': os.totalmem() / ( 1024 * 1024 * 1024 ) + 'GB',
  };
}

module.exports = {
  loadFrameworkVersionInformation,
  getOSInformation
};