const { genHandlers } = require('./events');
const { baseWarn, pluckModuleFunction } = require('../helpers');
const { camelize, no, extend, isReservedTagName, isPreveredIdentifier, globalComponentsRefName } = require('../utils');

const fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
const simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

class CodegenState {
  // options: CompilerOptions;
  // warn: Function;
  // transforms: Array<TransformFunction>;
  // dataGenFns: Array<DataGenFunction>;
  // directives: { [key: string]: DirectiveFunction };
  // maybeComponent: (el: ASTElement) => boolean;
  // onceId: number;
  // staticRenderFns: Array<string>;

  constructor(options) {
    this.options = options;
    this.warn = options.warn || baseWarn;
    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
    this.directives = extend({}, options.directives);
    const isReservedTag = options.isReservedTag || no;
    this.maybeComponent = el => !isReservedTag(el.tag);
    this.onceId = 0;
    this.staticRenderFns = [];
    this.originalTag = options.originalTag || false;
  }
}
exports.CodegenState = CodegenState;

exports.generate = generate;
function generate(ast, options) {
  const state = new CodegenState(options);
  const code = ast ? genElement(ast, state) : '';
  return {
    render: code,
    staticRenderFns: state.staticRenderFns
  };
}

/**
 * Find root node of element.
 */
function findRootNode(node) {
  if (undefined === node.parent) {
    return node;
  } else {
    return findRootNode(node.parent);
  }
}

exports.genElement = genElement;
function genElement(el, state) {
  const rootNode = findRootNode(el);
  rootNode.tagHelperMap = rootNode.tagHelperMap || {};
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state);
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state);
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state);
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0';
  } else if (el.tag === 'slot') {
    return genSlot(el, state);
  } else {
    // component or element
    let code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      const data = el.plain ? undefined : genData(el, state);

      const children = el.inlineTemplate ? null : genChildren(el, state, true);


      rootNode.tagHelperMap[el.tag] = el.tag;

      const tagStatement = `${globalComponentsRefName}['${el.tag}']||'${el.tag}'`;

      code = `_c(${tagStatement}${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`;
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code;
  }
}

function createUniqueTagHelper(tagName) {
  // $ is not valid in html tag
  // but a valid identifier in ecma
  let result = '';
  for (let i = 0; i < tagName.length; i++) {
    if (tagName[i] === '-') {
      result += '$';
    } else if (tagName[i] === '$') {
      result += '_';
    } else {
      result += tagName[i];
    }
  }
  if (isReservedTagName(result)) {
    // if prevered word like `switch`
    // it will be $switch to make it works
    return '$' + result;
  } else {
    return result;
  }
}

// hoist static sub-trees out
function genStatic(el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`);
  return `_m(${state.staticRenderFns.length - 1}${
    el.staticInFor ? ',true' : ''
  })`;
}

// v-once
function genOnce(el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.staticInFor) {
    let key = '';
    let parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break;
      }
      parent = parent.parent;
    }
    if (!key) {
      process.env.NODE_ENV !== 'production' &&
        state.warn('v-once can only be used inside v-for that is keyed. ');
      return genElement(el, state);
    }
    return `_o(${genElement(el, state)},${state.onceId++}${
      key ? `,${key}` : ''
    })`;
  } else {
    return genStatic(el, state);
  }
}

exports.genIf = genIf;
function genIf(el, state, altGen, altEmpty) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty);
}

function genIfConditions(conditions, state, altGen, altEmpty) {
  if (!conditions.length) {
    return altEmpty || '_e()';
  }

  const condition = conditions.shift();
  if (condition.exp) {
    return `(${condition.exp})?${genTernaryExp(
      condition.block
    )}:${genIfConditions(conditions, state, altGen, altEmpty)}`;
  } else {
    return `${genTernaryExp(condition.block)}`;
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp(el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state);
  }
}

exports.genFor = genFor;
function genFor(el, state, altGen, altHelper) {
  const exp = el.for;
  const alias = el.alias;
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';

  if (
    process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      `<${el.tag} v-for="${alias} in ${exp}">: component lists rendered with ` +
      'v-for should have explicit keys. ',
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (
    `${altHelper || '_l'}.call(this,(${exp}),` +
    `function(${alias}${iterator1}${iterator2}){` +
    `return ${(altGen || genElement)(el, state)}` +
    '})'
  );
}

exports.genData = genData;
function genData(el, state) {
  let data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  const dirs = genDirectives(el, state);
  if (dirs) data += dirs + ',';

  // key
  if (el.key) {
    data += `key:${el.key},`;
  }
  // ref
  if (el.ref) {
    data += `ref:${el.ref},`;
  }
  if (el.refInFor) {
    data += 'refInFor:true,';
  }
  // pre
  if (el.pre) {
    data += 'pre:true,';
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += `tag:"${el.tag}",`;
  }
  // module data generation functions
  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el, state);
  }
  // attributes
  if (el.attrs) {
    for (let i = 0, l = el.attrs.length; i < l; i++) {
      if (hasOwnBinding(el.attrs[i].value, el)) {
        el.attrs[i].binded = true;
      }
    }
    data += `${genProps(el.attrs)},`;
  }
  // DOM props
  if (el.props) {
    data += `domProps:{${genProps(el.props)}},`;
  }
  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false, state.warn, { el, state })},`;
  }
  if (el.nativeEvents) {
    data += `${genHandlers(el.nativeEvents, true, state.warn, { el, state })},`;
  }
  // slot target
  if (el.slotTarget && !(el.attrs && el.attrs.some((item) => item.name === 'slot'))) {
    data += `slot:${el.slotTarget},`;
  }
  // scoped slots
  if (el.scopedSlots) {
    data += `${genScopedSlots(el.scopedSlots, state)},`;
  }
  // component v-model
  if (el.model) {
    data += `model:{value:${el.model.value},callback:${
      el.model.callback
    },expression:${el.model.expression}},`;
  }
  // inline-template
  if (el.inlineTemplate) {
    const inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += `${inlineTemplate},`;
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data;
}

function genDirectives(el, state) {
  // todo: ling, support v-model
  // support v-html
  return '';
  const dirs = el.directives;
  if (!dirs) return;
  let res = 'directives:[';
  let hasRuntime = false;
  let i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    const gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
        dir.value
          ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}`
          : ''
      }${dir.arg ? `,arg:"${dir.arg}"` : ''}${
        dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
      }},`;
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']';
  }
}

function genInlineTemplate(el, state) {
  const ast = el.children[0];
  if (
    process.env.NODE_ENV !== 'production' &&
    (el.children.length > 1 || ast.type !== 1)
  ) {
    state.warn(
      'Inline-template components must have exactly one child element.'
    );
  }
  if (ast.type === 1) {
    const inlineRenderFns = generate(ast, state.options);
    return `inlineTemplate:{render:function(){${
      inlineRenderFns.render
    }},staticRenderFns:[${inlineRenderFns.staticRenderFns
      .map(code => `function(){${code}}`)
      .join(',')}]}`;
  }
}

function genScopedSlots(slots, state) {
  return `scopedSlots:_u([${Object.keys(slots)
    .map(key => {
      return genScopedSlot(key, slots[key], state);
    })
    .join(',')}])`;
}

function genScopedSlot(key, el, state) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state);
  }
  const fn = `function(${String(el.slotScope)}){` +
    `return ${el.tag === 'template'
      ? el.if
        ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined`
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)
    }}`;
  return `{key:${key},fn:${fn}}`;
}

function genForScopedSlot(key, el, state) {
  const exp = el.for;
  const alias = el.alias;
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';
  el.forProcessed = true; // avoid recursion
  return (
    `_l((${exp}),` +
    `function(${alias}${iterator1}${iterator2}){` +
    `return ${genScopedSlot(key, el, state)}` +
    '})'
  );
}
exports.genChildren = genChildren;
function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
  const children = el.children;
  if (children.length) {
    const el = children[0];
    // optimize single v-for
    if (
      children.length === 1 &&
      el.for &&
      el.tag !== 'template' &&
      el.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el, state);
    }
    const gen = altGenNode || genNode;
    return `[${children.map(c => gen(c, state)).join(',')}]`;
  }
}

function genNode(node, state) {
  if (node.type === 1) {
    return genElement(node, state);
  }
  if (node.type === 3 && node.isComment) {
    return genComment(node);
  } else {
    return genText(node);
  }
}

exports.genText = genText;
function genText(text) {
  return `_v(${
    text.type === 2
      ? text.expression // no need for () because already wrapped in _s()
      : transformSpecialNewlines(JSON.stringify(text.text))
  })`;
}

exports.genComment = genComment;
function genComment(comment) {
  return `_e('${comment.text}')`;
}

function genSlot(el, state) {
  const slotName = el.slotName || '"default"';
  const children = genChildren(el, state);
  let res = `_t(this,${slotName}${children ? `,${children}` : ''}`;
  const attrs =
    el.attrs &&
    `{${el.attrs.map(a => `${camelize(a.name)}:${a.value}`).join(',')}}`;
  const bind = el.attrsMap['v-bind'];
  if ((attrs || bind) && !children) {
    res += ',null';
  }
  if (attrs) {
    res += `,${attrs}`;
  }
  if (bind) {
    res += `${attrs ? '' : ',null'},${bind}`;
  }
  return res + ')';
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent(componentName, el, state) {
  const children = el.inlineTemplate ? null : genChildren(el, state, true);
  return `_c(${componentName},${genData(el, state)}${
    children ? `,${children}` : ''
  })`;
}

function genProps(props) {
  let res = '';
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    // { 'x-y': val }, { x: val }
    if (/[-\s]/.test(prop.name)) {
      prop.name = JSON.stringify(prop.name);
    }
    const scope = typeof prop.scope === 'string' ? props.scope : 'this';

    const isVariablePath = simplePathRE.test(prop.value);
    const isFunctionExpression = fnExpRE.test(prop.value);

    if (isVariablePath && !isFunctionExpression) {
      if (prop.binded || !scope) {
        // if binded, which means prop.value is an
        // identifier that binded to a parent function scope
      } else if (/[-\s]/.test(prop.value)) {
        prop.value = `${scope}['${prop.value}']`;
      } else if (isPreveredIdentifier(prop.value)) {
        // prevered id like `true,false,null,undefined...`
        prop.value = prop.value;
      } else {
        prop.value = `${scope}.${prop.value}`;
      }
    }
    res += `${prop.name}:${transformSpecialNewlines(prop.value)},`;
  }

  return res.slice(0, -1);
}

// #3895, #4268
function transformSpecialNewlines(text) {
  return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function hasOwnBinding(id, el) {
  if (el.alias && new RegExp(`^"?${el.alias}`).test(id)) {
    return true;
  }
  if (el.iterator1 && new RegExp(`^"?${el.iterator1}`).test(id)) {
    return true;
  }
  if (el.iterator2 && new RegExp(`^"?${el.iterator2}`).test(id)) {
    return true;
  }
  if (el.parent) {
    return hasOwnBinding(id, el.parent);
  } else {
    return false;
  }
}
