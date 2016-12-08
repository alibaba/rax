import loaderUtils from 'loader-utils';
import traverseImport from './TraverseImport';

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
module.exports = function(inputSource, inputSourceMap) {
  this.cacheable();
  const callback = this.async();

  const loaderOptions = loaderUtils.parseQuery(this.query);

  const options = Object.assign({ name: 'universal-env' }, loaderOptions);

  const { code } = traverseImport(options, inputSource);

  callback(null, code, inputSourceMap);
};
