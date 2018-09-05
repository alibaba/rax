module.exports = function(source) {
  let manifestJson = typeof source === 'string' ? JSON.parse(source) : source;

  const pages = manifestJson.pages;
  const pagesImport = Object.keys(pages).map((page) => {
    return `import Page${page} from './${pages[page]}';`;
  });

  const pagesMap = `{${Object.keys(pages)
    .map((page) => {
      return `${page}: Page${page}`;
    })
    .join(',')}
  }`;

  // Ensure the miniapp-web-renderer absolute path
  const miniappWebRendererPath = require.resolve('miniapp-web-renderer');

  const manifestCode = JSON.stringify(manifestJson)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `
import { render } from '${miniappWebRendererPath}';
${pagesImport.join('\n')}

const pagesMap = ${pagesMap};
const manifestData = ${manifestCode};
render(manifestData, pagesMap)`;
};
