const { dirname, join } = require('path');
const { existsSync, readFileSync } = require('fs');
const { parse } = require('sfc-compiler');
const { getAndRemoveAttr, getRootEl, normalizeMustache, addAttr } = require('../helpers');

const cwd = process.cwd();

function transformNode(el, state) {
  const rootEl = getRootEl(el);

  function resolveIncludePath(path) {
    if (/^\//.test(path)) {
      return join(cwd, path);
    } else {
      return join(state.templatePath, '..', path);
    }
  }

  if (el.tag === 'import' && el.attrsMap.hasOwnProperty('src')) {
    const templates = rootEl.templates || (rootEl.templates = []);
    const src = getAndRemoveAttr(el, 'src');
    templates.push(resolveIncludePath(src));
    // 3 means comment node
    el.type = 3;
    el.isComment = true;
  }

  // reg
  if (el.tag === 'template' && el.attrsMap.hasOwnProperty('name')) {
    rootEl.tplAlias = getAndRemoveAttr(el, 'name');

    /**
     * 单文件内部引用 template name
     */
    rootEl.tplASTs = rootEl.tplASTs || {};
    rootEl.tplASTs[rootEl.tplAlias] = el;
  }

  // template usage
  if (el.tag === 'template' && el.attrsMap.hasOwnProperty('is')) {
    el.tag = '$template';
    // do not confused with vue component is
    el.component = null;
    const { data } = el.attrsMap;
    if (data) {
      el.attrsMap.data = normalizeMustache(data, el);
    } else {
      /**
       * Template Data default to an empty object:
       * <view val="{{val}}" /> will be generated as
       *   _c('view', { val: data.val });
       * Should not throw exception if no data were passed.
       */
      addAttr(el, 'data', JSON.stringify({}));
    }
  }

  // include
  if (el.tag === 'include' && el.attrsMap.hasOwnProperty('src')) {
    el.tag = 'template';
    const { src } = el.attrsMap;
    const includePath = join(dirname(state.templatePath), src);
    if (!existsSync(includePath)) {
      console.log('Missing include file ' + src);
      return;
    }
    const includeContent = readFileSync(includePath, 'utf-8');
    const includeAST = parse(includeContent, Object.assign({}, state, {
      templatePath: includePath
    }));
    includeAST.parent = el;
    el.children = [
      includeAST
    ];

    if (includeAST.templates) {
      const templates = rootEl.templates || (rootEl.templates = []);
      includeAST.templates.forEach((importPath) => {
        templates.push(resolveIncludePath(importPath));
      });
    }
  }
};

function genData(el) {
  // template usage
  if (el.tag === '$template' && el.attrsMap.hasOwnProperty('is')) {
    const { is } = el.attrsMap;
    /**
     * _c('$template', {
     *   is: _w('name-of-component'),
     *   data: {}
     * })
     *
     * is maybe dynamic
     * _w(item % 2 ? 'odd' : 'even'),
     */
    const isExp = normalizeMustache(is, el);
    return `is: _w(${isExp === is ? `'${is}'` : isExp}), pageInstance: this,`;
  } else {
    return '';
  }
}

module.exports = {
  transformNode,
  genData
};
