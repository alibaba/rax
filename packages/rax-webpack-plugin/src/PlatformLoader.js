import path from 'path';
import loaderUtils from 'loader-utils';
import traverseImport from './TraverseImport';
import sourceMap from 'source-map';

/**
 * remove universal-env module dependencies
 * convert to constant
 * then use babel-plugin-minify-dead-code-elimination remove the dead code
 *
 * @example
 *
 * ../evn-loader/lib/index?isWeex=true
 *
 * `import { isWeex, isWeb } from 'universal-env'`;
 *
 * after:
 *
 * ```
 * const isWeex = true;
 * const isWeb = false
 * ```
 */

function mergeSourceMap(map, inputMap) {
  if (inputMap) {
    const inputMapConsumer = new sourceMap.SourceMapConsumer(inputMap);
    const outputMapConsumer = new sourceMap.SourceMapConsumer(map);

    const mergedGenerator = new sourceMap.SourceMapGenerator({
      file: inputMapConsumer.file,
      sourceRoot: inputMapConsumer.sourceRoot
    });

    // This assumes the output map always has a single source, since Babel always compiles a
    // single source file to a single output file.
    const source = outputMapConsumer.sources[0];

    inputMapConsumer.eachMapping(function(mapping) {
      const generatedPosition = outputMapConsumer.generatedPositionFor({
        line: mapping.generatedLine,
        column: mapping.generatedColumn,
        source: source
      });
      if (generatedPosition.column != null) {
        mergedGenerator.addMapping({
          source: mapping.source,

          original: mapping.source == null ? null : {
            line: mapping.originalLine,
            column: mapping.originalColumn
          },

          generated: generatedPosition
        });
      }
    });

    const mergedMap = mergedGenerator.toJSON();
    inputMap.mappings = mergedMap.mappings;
    return inputMap;
  } else {
    return map;
  }
}

module.exports = function(inputSource, inputSourceMap) {
  this.cacheable();
  const callback = this.async();
  const loaderOptions = loaderUtils.parseQuery(this.query);
  const resourcePath = this.resourcePath;
  const projectDir = process.cwd();

  let sourceMapOption = {
    sourceMapTarget: path.basename(resourcePath),
    soueceFileName: path.relative(projectDir, resourcePath),
    sourceMap: true,
    sourceRoot: projectDir
  };

  const options = Object.assign({ name: 'universal-env' }, loaderOptions);

  const { code, map } = traverseImport(options, inputSource, sourceMapOption);

  callback(null, code, mergeSourceMap(map, inputSourceMap));
};
