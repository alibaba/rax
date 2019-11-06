const { relative, join, dirname, extname } = require('path');
const sass = require('sass');
const less = require('less');
const stylus = require('stylus');
const stylesheetLoader = require('stylesheet-loader');

/**
 * convert sass/stylus to css
 *
 * @param {string} cssType  css/sass/scss/stylus
 * @param {string} content
 * @param {string} filename
 * @returns {string}
 */
async function compileCSS(cssType, content, filename) {
  let processedContent = content;
  switch (cssType) {
    case 'sass':
    case 'scss':
      processedContent = sass.renderSync({
        file: filename
      }).css.toString();
      break;
    case 'styl':
      processedContent = stylus(content)
        .set('filename', filename)
        .render();
      break;
    case 'less':
      processedContent = (await less.render(content, {
        filename
      })).css;
    default:
  }
  return processedContent;
}

function convertCSSUnit(raw, originExt = 'rem', targetExt = 'rpx') {
  const regexp = new RegExp(originExt, 'g');
  return raw.replace(regexp, targetExt); // Maybe could use postcss plugin instead.
}

function createCSSModule(content) {
  const loaderContext = { query: '?log=false' };
  return stylesheetLoader.call(loaderContext, content);
}

async function processCSS(cssFiles, sourcePath) {
  let style = '';
  const assets = {};
  for (let cssFile of cssFiles) {
    const cssType = extname(cssFile.filename).slice(1);
    cssFile.content = await compileCSS(cssType, cssFile.content, cssFile.filename);
    if (cssFile.type === 'cssObject') {
      const relativePath = relative(sourcePath, cssFile.filename);
      assets[relativePath + '.js'] = createCSSModule(cssFile.content);
    } else if (cssFile.type === 'cssFile') {
      style += convertCSSUnit(cssFile.content);
    }
  }
  return { style, assets };
}

module.exports = processCSS;
