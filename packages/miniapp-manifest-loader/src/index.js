module.exports = function(source) {
  let manifestJson = typeof source === 'string' ? JSON.parse(source) : source;

  const pages = manifestJson.pages;

  const pagesMap = `{
${Object.keys(pages)
    .map((page) => {
      return `"${page}": _requireReturnDefault(require('./${pages[page]}'))`;
    })
    .join(',\n')}
}`;

  // Ensure the miniapp-web-renderer absolute path
  const miniappWebRendererPath = require.resolve('miniapp-web-renderer');

  const manifestCode = JSON.stringify(manifestJson, null, 2)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `
import { render } from '${miniappWebRendererPath}';

function _requireReturnDefault(obj) { return obj && obj.__esModule ? obj.default : obj; }

const pagesMap = ${pagesMap};

const manifestData = ${manifestCode};

render(manifestData, pagesMap)`;
};
