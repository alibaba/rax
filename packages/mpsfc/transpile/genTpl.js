const camelcase = require('camelcase');
const evtNameMapping = {
  click: 'tap'
};
const tagNameMapping = {
  div: 'view',
  span: 'text',
  img: 'image',
  template: 'block',
};

/**
 * 用来保存状态
 */
class TplGenState {
  constructor(options) {
    this.options = options;

    /**
     * Object Map
     * key: title$xxxxx
     * value: { propsData }
     */
    this.propsDataMap = {};
    this.tplImports = options.tplImports || {};
    this.isTemplateDependency = options.isTemplateDependency || false;
    this.templateName = options.templateName || '';
  }
}

function traverse(ast, iterator) {
  // DFS
  if (Array.isArray(ast.children)) {
    for (let i = 0, l = ast.children.length; i < l; i++) {
      traverse(ast.children[i], iterator);
    }
  }
  iterator(ast);
}

/**
 * <view @click="handleClick" :foo="bar" style="{ }">
 *   <text>mustache {{ binding }} !</text>
 *   <!-- comment node-->
 * </view>
 */
function genElement(el, state) {
  if (!el) {
    return '';
  }

  if (Array.isArray(el)) {
    return el.map((_el) => {
      return genElement(_el, state);
    }).join('');
  }

  if (el.type === 1) {
    // type 1: element

    const hasProps = el.hasBindings || !!el.staticClass || !!el.classBinding || el.attrsList.length > 0;

    const camelTagName = camelcase(el.tag);
    if (state.tplImports[el.tag]) {
      return `<template is="${state.tplImports[el.tag].tplName}" data="{{${genData(el, state)}}}">${genElement(el.children, state)}</template>`;
    } else if (el.ifConditions) {
      return el.ifConditions
        .map((condition) => {
          // 避免递归
          condition.block.ifConditions = null;
          return genElement(condition.block, state);
        })
        .join('');
    } else {
      const tagName = tagNameMapping[el.tag] || el.tag;
      /**
       * 指令, 如 for, if
       */
      const directive = genDirective(el, state);
      return `<${tagName}${
        hasProps ? ' ' + genProps(el, state) : ''
        }${
        directive ? ' ' + directive : ''
        }>${genElement(el.children, state)}</${tagName}>`;
    }
  } else if (el.type === 2 || (el.type === 3 && el.static)) {
    // type 2: text node or static text node

    return genText(el, state);
  } else {
    // 忽略其它所有类型节点.
    return '';
  }
}

/**
 * text node has no children
 */
function genText(el, state) {
  return el.text;
}

// props = attrs + events
function genProps(el, state) {
  const attrs = [];
  el.attrsList.forEach(({ name, value }) => {
    if (name[0] === ':') {
      // bind
      const pty = name.slice(1);
      attrs.push(`${pty}="{{${value}}}"`);
    } else if (name[0] === '@') {
      // event
      const evtName = name.slice(1);
      const evtProp = 'on' +
        (evtNameMapping[evtName] || evtName).replace(/^(\w)/, ($1) => $1.toUpperCase());

      if (state.isTemplateDependency) {
        value = state.templateName + '$' + value;
      }
      attrs.push(`${evtProp}="${value}"`);
    } else {
      attrs.push(`${name}="${value}"`);
    }
  });
  if (el.staticClass || el.classBinding) {
    attrs.push(`class="${getStaticProp(el.staticClass)}${el.classBinding ? ` {{${el.classBinding}}}` : ''}"`);
  }
  return attrs.join(' ');
}

function genData(el, state) {
  const { tplName } = state.tplImports[el.tag];
  const propsData = state.propsDataMap[tplName] = {};

  el.attrsList.forEach(({ name, value }) => {
    if (name[0] === ':') {
      // bind
      const pty = name.slice(1);
      propsData[pty] = value;
    } else if (name[0] === '@') {
      // event
      // todo event pass
    } else {
      propsData[name] = `${value}`;
    }
  });

  return `$d, ...$d['${tplName}']`;
}

function genDirective(el, state) {
  const d = [];
  /**
   * for
   */
  if (el.for) {
    d.push(`a:for="{{${el.for}}}"`);
    if (el.alias) {
      d.push(`a:for-item="${el.alias}"`);
    }
    if (el.iterator1) {
      d.push(`a:for-index="${el.iterator1}"`);
    }
  }

  /**
   * if
   */
  if (el.if) {
    d.push(`a:if="{{${el.if}}}"`);
  } else if (el.elseif) {
    d.push(`a:elif="{{${el.elseif}}}"`);
  } else if (el.else) {
    d.push('a:else');
  }

  return d.join(' ');
}

const STATIC_PROP_REG = /^"?(.*)"/;
function getStaticProp(str) {
  const match = STATIC_PROP_REG.exec(str);
  return match ? match[1] : str;
}

/**
 * 生成 axml template
 * @param {Object} ast 
 */
module.exports = function genTpl(ast, options) {
  const state = new TplGenState(options);

  const template = genElement(ast, state);
  return {
    template,
    metadata: {
      propsDataMap: state.propsDataMap
    }
  }
}
