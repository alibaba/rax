const templateGenerator = require('lodash.template');
const { RawSource } = require('webpack-sources');
const SWTemplate = require('../templates/sw');
const SWBSTemplate = require('../templates/swbs');

const isArray = Array.isArray;

const PLUGIN_NAME = 'PWA_ServiceWorkerPlugin';
const HTML_PATH = 'web/index.html';
const SWBS_FILE_PATH = 'web/swbs.js';
const SW_FILE_PATH = 'web/sw.js';
const DEFAULT_IGNORE_LIST = ['/swbs.js/i'];

function patternToString(pattern) {
  return pattern.toString();
}

module.exports = class ServiceWorkerPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { serviceWorker, context } = this.options;
    const { pkg } = context;

    if (!serviceWorker) {
      // Exit if no serviceWorker config
      return;
    }

    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      const data = {
        // Precache list, specific URL required
        preCacheUrlList: isArray(serviceWorker.preCacheUrlList)
          ? serviceWorker.preCacheUrlList
          : [],
        // Ignore following assets, match thougth regExp
        // The service worker file can not be cache
        ignorePatternList: isArray(serviceWorker.ignorePatternList)
          ? DEFAULT_IGNORE_LIST
            .concat(serviceWorker.ignorePatternList)
            .map(patternToString)
          : DEFAULT_IGNORE_LIST,
        // Cache following assets, match thougth regExp
        savedCachePatternList: isArray(serviceWorker.savedCachePatternList)
          ? serviceWorker.savedCachePatternList.map(patternToString)
          : [],
        // Cache id
        cacheId: serviceWorker.cacheId || pkg.name,
        skipWaiting: serviceWorker.skipWaiting || false,
        clientsClaim: serviceWorker.clientsClaim || false,
        unregister: serviceWorker.unregister || false,
      };

      const SWBSCode = templateGenerator(SWBSTemplate)(data);
      const SWCode = templateGenerator(SWTemplate)(data);
      const scriptCode = `<script src="/${SWBS_FILE_PATH}" type="text/javascript" crossorigin="anonymous"></script>`;
      const htmlCode = compilation
        .assets[HTML_PATH]
        .source()
        .replace('</body>', `${scriptCode}</body>`);

      compilation.assets[SW_FILE_PATH] = new RawSource(SWCode);
      compilation.assets[SWBS_FILE_PATH] = new RawSource(SWBSCode);
      compilation.assets[HTML_PATH] = new RawSource(htmlCode);
      callback();
    });
  }
};
