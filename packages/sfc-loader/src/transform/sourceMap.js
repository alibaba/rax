const {
  SourceMapGenerator,
  SourceMapConsumer
} = require('source-map');

const splitRE = /\r?\n/g;
const emptyRE = /^(?:\/\/)?\s*$/;

module.exports = function generateSourceMap(
  filename,
  rawContent,
  scriptCode,
  declarationCode,
  sourceRoot,
  baseSourceMap,
  scriptBaseLine
) {
  const sourceMapConsumer = new SourceMapConsumer(baseSourceMap);
  const map = new SourceMapGenerator({
    file: filename,
    sourceRoot
  });
  map.setSourceContent(filename, rawContent);

  scriptCode.split(splitRE).forEach((line, index) => {
    if (!emptyRE.test(line)) {
      map.addMapping({
        source: filename,
        original: {
          line: index + scriptBaseLine,
          column: 0
        },
        generated: {
          line: index + scriptBaseLine,
          column: 0
        }
      });
    }
  });

  // map.applySourceMap(sourceMapConsumer, filename);

  return map.toJSON();
};
