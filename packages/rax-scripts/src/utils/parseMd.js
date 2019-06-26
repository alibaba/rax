const remarkAbstract = require('remark');
const colors = require('chalk');

const remark = remarkAbstract();

function html2Escape(sHtml) {
  return sHtml.replace(/[<>&"]/g, function(c) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
  });
}

/**
 * 解析 demo markdown
 * @param name 名称
 * @param content Markdown 内容
 * @param filePath 文件路径
 * @returns { Object } result { meta: {name, order, title, desc } }
 */
module.exports = (name, content, filePath) => {
  const result = {
    meta: {
      name
    },
    js: null,
    css: null,
    html: null
  };

  if (!content) return result;

  const AST = remark.parse(content);

  if (!AST || !AST.children) {
    colors.yellow(`Can not parse the demo md: ${filePath}`);
    return result;
  }

  // meta

  const metaReg = /---(.|\n)*---/g;
  let metaArray = content.match(metaReg);

  if (metaArray && metaArray.length > 0) {
    content = content.replace(metaReg, '');
    metaArray.forEach((metaStr) => {
      if (!metaStr) return;
      metaStr = metaStr.replace(/---/g, '');
      metaStr.split('\n')
        .map(str => str.trim())
        .filter(str => !!str)
        .forEach((metaItemStr) => {
          const index = metaItemStr.indexOf(':');
          result.meta[metaItemStr.substring(0, index).trim()] = metaItemStr.substring(index + 1).trim();
        });
    });
  }

  // title
  const titleNode = AST.children.find((child) => child.type === 'heading' && child.depth === 1);
  if (titleNode && titleNode.children && titleNode.children[0]) {
    result.meta.title = titleNode.children[0].value;
  }

  // desc
  const paragraphNode = AST.children.find((child) => child.type === 'paragraph');
  let desc = '';
  if (paragraphNode && paragraphNode.children) {
    desc = paragraphNode.children
      .map((itemNode) => {
        if (itemNode.type === 'inlineCode') {
          return `<code>${html2Escape(itemNode.value)}</code>`;
        }
        return itemNode.value;
      })
      .join(' ');
  }
  result.meta.desc = desc;

  // code
  const body = AST.children;
  const jsNode = body.find((child) => child.type === 'code' && (child.lang === 'js' || child.lang === 'jsx'));
  if (jsNode) {
    result.js = jsNode.value;
  }

  const cssNode = body.find((child) => child.type === 'code' && child.lang === 'css');
  if (cssNode) {
    result.css = cssNode.value;
  }

  const htmlNode = body.find((child) => child.type === 'code' && child.lang === 'html');
  if (htmlNode) {
    result.html = htmlNode.value;
  }

  return result;
};

