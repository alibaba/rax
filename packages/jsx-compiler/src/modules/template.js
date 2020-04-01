const t = require('@babel/types');
const { relative, extname, dirname } = require('path');
const { NodePath } = require('@babel/traverse');
const isFunctionComponent = require('../utils/isFunctionComponent');
const isClassComponent = require('../utils/isClassComponent');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const genExpression = require('../codegen/genExpression');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const findIndex = require('../utils/findIndex');
const getExportComponentPath = require('../utils/getExportComponentPath');
const getProgramPath = require('../utils/getProgramPath');

const TEMPLATE_AST = 'templateAST';
const RENDER_FN_PATH = 'renderFunctionPath';

function removeExt(path) {
  const ext = extname(path);
  return path.slice(0, path.length - ext.length);
}

function transformComTemplate(parsed, options, code) {
  const { ast, templateAST, imported, usingComponents } = parsed;
  const importComponents = [];
  traverse(templateAST, {
    JSXElement: {
      exit(path) {
        const { node: {
          openingElement
        } } = path;
        if (openingElement) {
          if (t.isJSXIdentifier(openingElement.name)
            && openingElement.name.name === 'template'
            && openingElement.attributes.find(attr => t.isJSXIdentifier(attr.name) && attr.name.name === 'pagePath')
          ) {
            Object.keys(usingComponents || {}).forEach((v) => {
              let src = usingComponents[v];
              if (/^c-/.test(v)) {
                let result = './' + relative(dirname(options.resourcePath), src); // components/Repo.jsx
                src = `${removeExt(result)}.${options.adapter.ext}`;
              }
              importComponents.push(genExpression(createJSX('import', {
                src: t.stringLiteral(src),
                name: t.stringLiteral(v)
              }), {
                comments: false,
                concise: true,
              }));
            });
          } else {
            path.skip();
          }
        } else {
          path.skip();
        }
      }
    }
  });
  return {
    importComponents,
    templateAST
  };
}
/**
 * Extract JSXElement path.
 */
module.exports = {
  parse(parsed, code, options) {
    const { defaultExportedPath, ast } = parsed;
    const { adapter } = options;
    if (!defaultExportedPath) return;
    const exportComponentPath = parsed.exportComponentPath = getExportComponentPath(defaultExportedPath, getProgramPath(ast), code);
    const renderFnPath = isFunctionComponent(exportComponentPath)
      ? exportComponentPath
      : isClassComponent(exportComponentPath)
        ? getRenderMethodPath(exportComponentPath)
        : undefined;
    if (!renderFnPath) return;

    const returnPath = getReturnElementPath(renderFnPath);
    if (!returnPath) throw new Error('Can not find JSX Statements in ' + options.resourcePath);
    let returnArgument = returnPath.get('argument').node;
    // support render mulit elements
    if (t.isArrayExpression(returnPath.get('argument')) && adapter.singleFileComponent) {
      returnArgument = createJSX(adapter.baseComponent, {
        class: t.stringLiteral('__rax-view')
      }, returnPath.get('argument').node.elements);
    }
    if (!['JSXText', 'JSXExpressionContainer', 'JSXSpreadChild', 'JSXElement', 'JSXFragment'].includes(returnArgument.type)) {
      returnArgument = t.jsxExpressionContainer(returnArgument);
    }
    returnPath.remove();
    if (!adapter.singleFileComponent) {
      parsed[TEMPLATE_AST] = createJSX('block', {
        [options.adapter.if]: t.stringLiteral(createBinding('$ready')),
      }, [returnArgument]);
      parsed[RENDER_FN_PATH] = renderFnPath;
    } else {
      const template = createJSX(adapter.baseComponent, { class: t.stringLiteral('page-container __rax-view') }, [returnArgument]);
      parsed[TEMPLATE_AST] = createJSX('template', { pagePath: t.stringLiteral('true') }, [template]);
      parsed[RENDER_FN_PATH] = renderFnPath;
    }
  },
  generate(ret, parsed, options) {
    if (parsed[TEMPLATE_AST]) {
      const { importComponents } = transformComTemplate(parsed, options);
      ret.importComponents = ret.importComponents ? ret.importComponents.concat(importComponents) : importComponents;
      const children = parsed[TEMPLATE_AST].children || [];
      const lastTemplateDefineIdx = findIndex(children,
        (node) => t.isJSXElement(node) && node.openingElement.name.name !== 'template');
      const templateDefineNodes = children.splice(0, lastTemplateDefineIdx);
      ret.template = [
        ...templateDefineNodes.map(node => genExpression(node, {
          comments: false,
          concise: true,
        })),
        genExpression(parsed[TEMPLATE_AST], {
          comments: false,
          concise: true,
        })
      ].join('\n');
    }
  },
};

/**
 * Get the render function path from class component declaration..
 * @param path {NodePath} A nodePath that contains a render function.
 * @return {NodePath} Path to render function.
 */
function getRenderMethodPath(path) {
  let renderMethodPath = null;
  traverse(path, {
    /**
     * Example:
     *   class {
     *     render() {}
     *   }
     */
    ClassMethod(classMethodPath) {
      const { node } = classMethodPath;
      if (t.isIdentifier(node.key, { name: 'render' })) {
        renderMethodPath = classMethodPath;
      }
    },
    /**
     * Example:
     *   class {
     *     render = function() {}
     *     render = () => {}
     *   }
     */
    ClassProperty(path) {
      // TODO: support class property defined render function.
    },
  });

  return renderMethodPath;
}
