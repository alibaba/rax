/**
 * Store generate state
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
    this.dependencyMap = options.dependencyMap || {};
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
 * Generate mini-program template stynax:
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
    return el.map((_el) => genElement(_el, state)).join('');
  }

  if (el.type === 1) {
    // Type 1: element
    if (state.dependencyMap[el.tag]) {
      return `<template is="${state.dependencyMap[el.tag].templateName}" data="{{${genData(el, state)}}}">${genElement(
        el.children,
        state
      )}</template>`;
    } else if (el.ifConditions) {
      return el.ifConditions
        .map((condition) => {
          // 避免递归
          condition.block.ifConditions = null;
          return genElement(condition.block, state);
        })
        .join('');
    } else {
      const hasAttrs = el.hasBindings || el.attrs;
      return `<${el.tag}${hasAttrs ? ' ' + genAttrs(el, state) : ''}${genModuleData(el, state)}>${genElement(
        el.children,
        state
      )}</${el.tag}>`;
    }
  } else if (el.type === 2 || el.type === 3 && el.static) {
    // Type 2: text node or static text node
    return genText(el, state);
  } else {
    // Ignore other types
    return '';
  }
}

/**
 * Text node has no children
 */
function genText(el) {
  return el.text;
}

/**
 * Call module genData fn
 */
function genModuleData(el, state) {
  let data = '',
    l;
  if (Array.isArray(state.modules) && (l = state.modules.length) > 0) {
    for (let i = 0; i < l; i++) {
      if (typeof state.modules[i].genData === 'function') {
        data += ' ' + state.modules[i].genData(el, state);
      }
    }
  }
  return data;
}

/**
 * Handle bind values
 */
function genAttrs(el, state) {
  if (el.attrs) {
    return el.attrs
      .map(({ name, value }) => {
        if (el.attrsMap['v-on:' + name] || el.attrsMap[':' + name]) {
          return `${name}="{{${value}}}"`;
        } else {
          return `${name}=${value}`;
        }
      })
      .join(' ');
  } else {
    return '';
  }
}

/**
 * Generate data
 */
function genData(el, state) {
  const { templateName } = state.dependencyMap[el.tag];
  const propsData = state.propsDataMap[templateName] = {};

  el.attrsList.forEach(({ name, value }) => {
    if (name[0] === ':' || name[0] === 'v-bind:') {
      const pty = name.slice(name[0].length);
      propsData[pty] = value;
    } else {
      propsData[name] = `${value}`;
    }
  });

  return `$d, ...$d['${templateName}']`;
}

/**
 * Generate axml template
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
