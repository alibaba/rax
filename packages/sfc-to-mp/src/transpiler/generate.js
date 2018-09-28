const camelcase = require('camelcase');
const traverse = require('./traverse');

const evtNameMapping = {
  click: 'tap',
};

/**
 * store generate state
 */
class GeneratorState {
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

    if (options && options.modules) {
      this.modules = options.modules;
    } else {
      this.modules = [];
    }
  }
}

/**
 * generate mini-program template stynax:
 * <view @click="handleClick" :foo="bar" style="{ }">
 *   <text>mustache {{ binding }} !</text>
 * </view>
 * commnet node is ignored
 */
function genElement(el, state) {
  if (!el) {
    return '';
  }

  if (Array.isArray(el)) {
    return el.map(_el => genElement(_el, state)).join('');
  }

  if (el.type === 1) {
    // type 1: element
    const hasProps =
      el.hasBindings ||
      !!el.staticClass ||
      !!el.classBinding ||
      el.attrsList.length > 0;

    if (state.tplImports[el.tag]) {
      return `<template is="${
        state.tplImports[el.tag].tplName
      }" data="{{${genData(el, state)}}}">${genElement(
        el.children,
        state
      )}</template>`;
    } else if (el.ifConditions) {
      return el.ifConditions
        .map(condition => {
          // 避免递归
          condition.block.ifConditions = null;
          return genElement(condition.block, state);
        })
        .join('');
    } else {
      // directive, like for, if
      const moduleData = genModuleData(el, state);
      return `<${el.tag}${
        hasProps ? ' ' + genProps(el, state) : ''
      }${moduleData}>${genElement(el.children, state)}</${el.tag}>`;
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
function genText(el) {
  return el.text;
}

/**
 * call module genData fn
 */
function genModuleData(el, state) {
  let data = '',
    l;
  if (
    Array.isArray(state.modules) &&
    (l = state.modules.length) > 0
  ) {
    for (let i = 0; i < l; i++) {
      if (typeof state.modules[i].genData === 'function') {
        data += ' ' + state.modules[i].genData(el, state);
      }
    }
  }
  return data;
}

/**
 * props = attrs + events
 */
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
      const evtProp =
        'on' +
        (evtNameMapping[evtName] || evtName).replace(/^(\w)/, $1 =>
          $1.toUpperCase()
        );
      if (state.isTemplateDependency) {
        value = state.templateName + '$' + value;
      }
      attrs.push(`${evtProp}="${value}"`);
    } else {
      attrs.push(`${name}="${value}"`);
    }
  });
  if (el.staticClass || el.classBinding) {
    attrs.push(
      `class="${getStaticProp(el.staticClass)}${
        el.classBinding ? ` {{${el.classBinding}}}` : ''
      }"`
    );
  }
  return attrs.join(' ');
}

/**
 * generate data
 */
function genData(el, state) {
  const { tplName } = state.tplImports[el.tag];
  const propsData = (state.propsDataMap[tplName] = {});

  el.attrsList.forEach(({ name, value }) => {
    if (name[0] === ':' || name[0] === 'v-bind:') {
      // bind
      const pty = name.slice(name[0].length);
      propsData[pty] = value;
    } else {
      propsData[name] = `${value}`;
    }
  });

  return `$d, ...$d['${tplName}']`;
}

function genDirective(el, state) {
  const directives = [];

  // for
  if (el.for) {
    directives.push(`a:for="{{${el.for}}}"`);
    if (el.alias) {
      directives.push(`a:for-item="${el.alias}"`);
    }
    if (el.iterator1) {
      directives.push(`a:for-index="${el.iterator1}"`);
    }
  }

  // if
  if (el.if) {
    directives.push(`a:if="{{${el.if}}}"`);
  } else if (el.elseif) {
    directives.push(`a:elif="{{${el.elseif}}}"`);
  } else if (el.else) {
    directives.push('a:else');
  }

  return directives.join(' ');
}

const STATIC_PROP_REG = /^"?(.*)"/;
function getStaticProp(str) {
  const match = STATIC_PROP_REG.exec(str);
  return match ? match[1] : str;
}

/**
 * generate axml template
 * @param {Object} ast
 * @param {Object} options
 */
module.exports = function generate(ast, options) {
  const state = new GeneratorState(options);

  const template = genElement(ast, state);
  return {
    template,
    metadata: {
      propsDataMap: state.propsDataMap,
    },
  };
};
