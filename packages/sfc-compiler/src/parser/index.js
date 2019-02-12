const he = require('he');
const { parseHTML } = require('./html-parser');
const { parseText } = require('./text-parser');
const { parseFilters } = require('./filter-parser');
const { cached, no, camelize, extend } = require('../utils');

const {
  addProp,
  addAttr,
  baseWarn,
  addHandler,
  addDirective,
  getBindingAttr,
  getAndRemoveAttr,
  pluckModuleFunction
} = require('../helpers');

const onRE = /^@|^v-on:/;
const dirRE = /^v-|^@|^:/;
const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
const stripParensRE = /^\(|\)$/g;
exports.onRE = onRE;
exports.dirRE = dirRE;
exports.forAliasRE = forAliasRE;
exports.forIteratorRE = forIteratorRE;
exports.stripParensRE = stripParensRE;

const argRE = /:(.*)$/;
const bindRE = /^:|^v-bind:/;
const modifierRE = /\.[^.]+/g;

const decodeHTMLCached = cached(he.decode);

// configurable state
let warn;
exports.warn = warn;

let delimiters;
let transforms;
let preTransforms;
let postTransforms;
let platformIsPreTag;
let platformMustUseProp;
let platformGetTagNamespace;

exports.parse = parse;
/**
 * Convert HTML string to AST.
 */
function parse(template, options) {
  warn = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  const stack = [];
  const preserveWhitespace = options.preserveWhitespace !== false;
  const trimTextWhitespace = options.trimTextWhitespace;

  let root;
  let currentParent;
  let inVPre = false;
  let inPre = false;
  let warned = false;

  function warnOnce(msg) {
    if (!warned) {
      warned = true;
      warn(msg);
    }
  }

  function endPre(element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments,
    start(tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      const ns =
        currentParent && currentParent.ns || platformGetTagNamespace(tag);

      const element = {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element)) {
        element.forbidden = true;
        process.env.NODE_ENV !== 'production' &&
          warn(
            'Templates should only be responsible for mapping the state to the ' +
            'UI. Avoid placing tags with side-effects in your templates, such as ' +
            `<${tag}>` +
            ', as they will not be parsed.'
          );
      }

      // apply pre-transforms
      for (let i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlotContent(element);
        processSlotOutlet(element);
        processComponent(element);
        for (let i = 0; i < transforms.length; i++) {
          transforms[i](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints(el) {
        if (process.env.NODE_ENV !== 'production') {
          // if (el.tag === 'slot' || el.tag === 'template') {
          if (el.tag === 'slot') {
            warnOnce(
              `Cannot use <${
                el.tag
              }> as component root element because it may ` +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (process.env.NODE_ENV !== 'production') {
          warnOnce(
            'Component template should contain exactly one root element. ' +
            'If you are using v-if on multiple elements, ' +
            'use v-else-if to chain them instead.'
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) {
          // scoped slot
          currentParent.plain = false;
          const name = element.slotTarget || '"default"';
          (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[
            name
          ] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (let i = 0; i < postTransforms.length; i++) {
        postTransforms[i](element, options);
      }
    },

    end() {
      // remove trailing whitespace
      const element = stack[stack.length - 1];
      const lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars(text) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if (text = text.trim()) {
            warnOnce(`text "${text}" outside root element will be ignored.`);
          }
        }
        return;
      }

      const children = currentParent.children;
      text =
        inPre || text.trim()
          ? isTextTag(currentParent)
            ? text
            : decodeHTMLCached(text)
          : // only preserve whitespace if its not right after a starting tag
          preserveWhitespace && children.length
            ? ' '
            : '';

      // Trim text node
      if (trimTextWhitespace) {
        text = text.trim();
      }

      if (text) {
        let expression;
        if (
          !inVPre &&
          text !== ' ' &&
          (expression = parseText(text, delimiters))
        ) {
          children.push({
            type: 2,
            expression,
            text
          });
        } else if (
          text !== ' ' ||
          !children.length ||
          children[children.length - 1].text !== ' '
        ) {
          children.push({
            type: 3,
            text
          });
        }
      }
    },
    comment(text) {
      currentParent.children.push({
        type: 3,
        text,
        isComment: true
      });
    }
  });
  return root;
}

function processPre(el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs(el) {
  const l = el.attrsList.length;
  if (l) {
    const attrs = el.attrs = new Array(l);
    for (let i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey(el) {
  const exp = getBindingAttr(el, 'key');
  if (exp) {
    if (process.env.NODE_ENV !== 'production' && el.tag === 'template') {
      warn(
        '<template> cannot be keyed. Place the key on real elements instead.'
      );
    }
    el.key = exp;
  }
}

function processRef(el) {
  const ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor(el) {
  let exp;
  if (exp = getAndRemoveAttr(el, 'v-for')) {
    const res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else if (process.env.NODE_ENV !== 'production') {
      warn(
        `Invalid v-for expression: ${exp}`,
        el.attrsMap['v-for']
      );
    }
  }
}

function parseFor(exp) {
  const inMatch = exp.match(forAliasRE);
  if (!inMatch) return;
  const res = {};
  res.for = inMatch[2].trim();
  const alias = inMatch[1].trim().replace(stripParensRE, '');
  const iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim();
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res;
}

function processIf(el) {
  const exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    const elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions(el, parent) {
  const prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `v-${el.elseif ? 'else-if="' + el.elseif + '"' : 'else'} ` +
      `used on element <${el.tag}> without corresponding v-if.`
    );
  }
}

function findPrevElement(children) {
  let i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i];
    } else {
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        warn(
          `text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
          'will be ignored.'
        );
      }
      children.pop();
    }
  }
}

function addIfCondition(el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce(el) {
  const once = getAndRemoveAttr(el, 'v-once');
  if (once != null) {
    el.once = true;
  }
}

// handle content being passed to a component as slot,
// e.g. <template slot="xxx">, <div slot-scope="xxx">
function processSlotContent(el) {
  let slotScope;
  if (el.tag === 'template') {
    slotScope = getAndRemoveAttr(el, 'scope');
    el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
  } else if (slotScope = getAndRemoveAttr(el, 'slot-scope')) {
    el.slotScope = slotScope;
  }

  // slot="xxx"
  const slotTarget = getBindingAttr(el, 'slot');
  if (slotTarget) {
    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    // preserve slot as an attribute for native shadow DOM compat
    // only for non-scoped slots.
    if (el.tag !== 'template' && !el.slotScope) {
      addAttr(el, 'slot', slotTarget, getBindingAttr(el, 'slot'));
    }
  }

  // TODO: v-slot syntax for SFC.
}

// handle <slot/> outlets
function processSlotOutlet(el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
  }
}

function processComponent(el) {
  let binding = getBindingAttr(el, 'is');
  if (binding) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs(el) {
  const list = el.attrsList;
  let i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) {
        // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;

        if (
          !el.component &&
          (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name))
        ) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) {
        // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn);
      } else {
        // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        const argMatch = name.match(argRE);
        const arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (process.env.NODE_ENV !== 'production') {
        const expression = parseText(value, delimiters);
        if (expression) {
          // warn(
          //   `${name}="${value}": ` +
          //     'Interpolation inside attributes has been removed. ' +
          //     'Use v-bind or the colon shorthand instead. For example, ' +
          //     'instead of <div id="{{ val }}">, use <div :id="val">.'
          // );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor(el) {
  let parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

function parseModifiers(name) {
  const match = name.match(modifierRE);
  if (match) {
    const ret = {};
    match.forEach(m => {
      ret[m.slice(1)] = true;
    });
    return ret;
  }
}

function makeAttrsMap(attrs) {
  const map = {};
  for (let i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name]
    ) {
      warn('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map;
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag(el) {
  return el.tag === 'script' || el.tag === 'style';
}

function isForbiddenTag(el) {
  return (
    el.tag === 'style' ||
    el.tag === 'script' &&
    (!el.attrsMap.type || el.attrsMap.type === 'text/javascript')
  );
}

function checkForAliasModel(el, value) {
  let _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn(
        `<${el.tag} v-model="${value}">: ` +
        'You are binding v-model directly to a v-for iteration alias. ' +
        'This will not be able to modify the v-for source array because ' +
        'writing to the alias is like modifying a function local variable. ' +
        'Consider using an array of objects and use v-model on an object property instead.'
      );
    }
    _el = _el.parent;
  }
}
