const uppercamelcase = require('uppercamelcase');
const addThis = require('./addThis');

const fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
const simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
const keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  delete: [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
const genGuard = condition => `if(${condition})return null;`;

const modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard('$event.target !== $event.currentTarget'),
  ctrl: genGuard('!$event.ctrlKey'),
  shift: genGuard('!$event.shiftKey'),
  alt: genGuard('!$event.altKey'),
  meta: genGuard('!$event.metaKey'),
  left: genGuard('\'button\' in $event && $event.button !== 0'),
  middle: genGuard('\'button\' in $event && $event.button !== 1'),
  right: genGuard('\'button\' in $event && $event.button !== 2')
};

exports.genHandlers = genHandlers;
function genHandlers(events, isNative, warn, opts) {
  // let res = isNative ? 'nativeOn:{' : 'on:{';
  let res = '';
  for (const name in events) {
    const handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (
      process.env.NODE_ENV !== 'production' &&
      name === 'click' &&
      handler &&
      handler.modifiers &&
      handler.modifiers.right
    ) {
      warn(
        'Use "contextmenu" instead of "click.right" since right clicks ' +
        'do not actually fire "click" events.'
      );
    }

    if (name[0] === '~' || name[0] === '&' || name[0] === '!') {
      let key = `on${uppercamelcase(name.slice(1))}`;
      // todo support modifiers
      // 支持修饰符
      res += `${key}:${genHandler(name, handler, opts)},`;
    } else {
      // rax 识别事件 prop: /^on[A-Z]/
      let key = `on${name.slice(0, 1).toUpperCase()}${name.slice(1)}`;
      if (/-/.test(key)) {
        // { 'onKey-key': fn }
        key = JSON.stringify(key);
      }
      res += `${key}:${genHandler(name, handler, opts)},`;
    }
  }
  return res.slice(0, -1);
}

function genHandler(name, handler, opts) {
  if (!handler) {
    return 'function(){}';
  }

  if (Array.isArray(handler)) {
    return `[${handler
      .map(handler => genHandler(name, handler, opts))
      .join(',')}]`;
  }

  const isMethodPath = simplePathRE.test(handler.value);
  const isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? // foo-bar will be treated as `this.foo - this.bar` fn expression
      // so only need handle `this.fooo`
      (typeof handler.scope === 'string' ? handler.scope : 'this.') + handler.value
      : // add this. for all identifiers
      `function($event){${handler.disableAddThis ? handler.value : addThis(
        handler.value,
        opts.state.isScopedIdentifier,
        opts.el
      )}}.bind(this)`; // inline statement
  } else {
    let code = '';
    let genModifierCode = '';
    const keys = [];
    for (const key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    const handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? `(${handler.value})($event)`
        : handler.value;

    return `function($event){${code}${handlerCode}}.bind(this)`;
  }
}

function genKeyFilter(keys) {
  return `if(!('button' in $event)&&${keys
    .map(genFilterCode)
    .join('&&')})return null;`;
}

function genFilterCode(key) {
  const keyVal = parseInt(key, 10);
  if (keyVal) {
    return `$event.keyCode!==${keyVal}`;
  }
  const alias = keyCodes[key];
  return `_k($event.keyCode,${JSON.stringify(key)}${
    alias ? ',' + JSON.stringify(alias) : ''
  })`;
}
