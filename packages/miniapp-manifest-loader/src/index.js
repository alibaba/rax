module.exports = function(source) {
  let value = typeof source === 'string' ? JSON.parse(source) : source;

  const pages = value.pages;
  const pagesRequire = Object.keys(pages).map((page) => {
    return `import Page${page} from './${pages[page]}';`;
  });

  const pagesMap = `{${Object.keys(pages)
    .map((page) => {
      return `${page}: Page${page}`;
    })
    .join(',')}
  }`;

  const miniappWebRendererPath = require.resolve('miniapp-web-renderer');

  const manifestData = JSON.stringify(value)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `
import { render } from '${miniappWebRendererPath}';
${pagesRequire.join('\n')}

const pagesMap = ${pagesMap};
const manifestData = ${manifestData};
render(manifestData, pagesMap)`;
};
