const convertSourceMap = require('convert-source-map');

function addSourceMap(code, rawCode, originalMap) {
  const map = Object.assign(originalMap, {
    sourcesContent: [rawCode]
  });
  const sourceMapString = convertSourceMap.fromObject(map).toComment();
  return code + '\n' + sourceMapString;
}

module.exports = addSourceMap;
