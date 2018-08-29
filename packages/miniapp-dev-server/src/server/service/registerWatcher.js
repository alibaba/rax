const chokidar = require('chokidar');
const webpack = require('webpack');
const colors = require('colors');
const { join } = require('path');
const {
  getWebpackConfig,
  getMiniappType,
  getPages,
} = require('miniapp-compiler-shared');
const { isEqual } = require('lodash');

let pages = null;
/**
 * 有差异 rerun true ，否则 return undefined
 */
function compareConfigPages(workDir) {
  let newPages = getPages(workDir);
  let oldPages = pages;
  pages = newPages;
  return isEqual(oldPages, newPages);
}

function updateCompiler(middleware, workDir) {
  const webpackConfig = getWebpackConfig(workDir, true);

  middleware.dev().close(() => {
    middleware.update(webpack(webpackConfig));
  });
}

module.exports = function(middleware, workDir) {
  const type = getMiniappType(workDir);
  pages = getPages(workDir);

  chokidar
    .watch(join(workDir, type === 'sfc' ? 'manifest.json' : 'app.json'), {
      ignored: /[\/\\]\./,
      ignoreInitial: true,
    })
    .on('all', (event, _path) => {
      try {
        if (!compareConfigPages(workDir)) {
          updateCompiler(middleware, workDir);
        }
      } catch (err) {
        console.log(colors.red('Err while update compiler:'), err);
      }
    });
};
