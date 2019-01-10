const axios = require('axios');
const defaultFrameworkVersion = require('./frameworkVersion');

const NPM_NAME = 'miniapp-framework';
const DEFAULT_REGISTRIES = [
  'https://registry.npm.taobao.org',
  'https://r.cnpmjs.org',
  'https://registry.npmjs.com',
];

function getFrameworkVersion(tag = 'latest') {
  return getRemotePackage(NPM_NAME, tag, process.env.NPM_REGISTRY)
    .then((response) => {
      return response && response.version || defaultFrameworkVersion;
    });
}

function getRemotePackage(name, tag, registry) {
  const registries = (registry ? [ registry ] : []).concat(DEFAULT_REGISTRIES);

  return (function run(registries, idx) {
    if (!registries[idx]) return Promise.resolve(null);
    const registryPackageURL = registries[idx] + '/' + name + '/' + tag;
    return axios({ url: registryPackageURL, responseType: 'json', timeout: 1000 })
      .then((response) => response.data)
      .catch(() => run(registries, idx + 1));
  })(registries, 0);
}

module.exports = getFrameworkVersion;
