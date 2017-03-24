'use strict';

module.exports = function(source, inputMap) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();

  if (/\bmodule.hot\b/.test(source)) {
    return callback(null, source, inputMap);
  }

  const entry = this.options.entry;
  const resourcePath = this.resourcePath;

  let resourcePathInEntry = false;

  Object.keys(entry).forEach(point => {
    if (Array.isArray(entry[point])) {
      resourcePathInEntry = entry[point].some(entryFile => {
        return entryFile.startsWith(resourcePath);
      });
    }
  });

  if (!resourcePathInEntry) {
    return callback(null, source, inputMap);
  }

  return callback(
    null,
    `${source}
    
// HMR append by rax-scripts/loaders/module-hot-accept.js
// @see https://github.com/alibaba/rax
module.hot.accept(function(err){
  if (err) {
    console.log(err);
  }
});`,
    inputMap
  );
};
