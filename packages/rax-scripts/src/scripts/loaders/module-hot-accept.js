'use strict';

const loaderUtils = require('loader-utils');

/**
 * append 'modult.hot.accept()' to entry point source.
 */
module.exports = function(source, inputMap) {
  if (this.cacheable) {
    this.cacheable(true);
  }

  const callback = this.async();

  if (/\bmodule.hot\b/.test(source)) {
    return callback(null, source, inputMap);
  }

  const query = this.query === '' ? {} : loaderUtils.parseQuery(this.query);
  const resourcePath = this.resourcePath;

  let resourcePathInEntry = query.appIndex && query.appIndex.startsWith(resourcePath);

  if (!resourcePathInEntry) {
    return callback(null, source, inputMap);
  }

  return callback(
    null,
    `${source}

// HMR append by rax-scripts/loaders/module-hot-accept.js
// @see https://github.com/alibaba/rax
if (module.hot) {
  module.hot.accept(function(err) {
    if (err) {
      console.log(err);
    } else {
      if (typeof App !== 'undefined') {
        render(<App />)
      } else {
        console.error('\`App\` components must exist!')
      }
    }
  });
}
`,
    inputMap
  );
};
