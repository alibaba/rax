'use strict';
import {Component as RaxComponent} from 'rax';
import PropTypes from 'prop-types';

const DEV =
  typeof process === 'undefined' ||
  !process.env ||
  process.env.NODE_ENV !== 'production';
// don't autobind these methods since they already have guaranteed context.
const AUTOBIND_BLACKLIST = {
  constructor: 1,
  render: 1,
  shouldComponentUpdate: 1,
  componentWillReceiveProps: 1,
  componentWillUpdate: 1,
  componentDidUpdate: 1,
  componentWillMount: 1,
  componentDidMount: 1,
  componentWillUnmount: 1,
  componentDidUnmount: 1
};

const BYPASS_HOOK = {};

/** Track current render() component for ref assignment */
let currentComponent;

function newComponentHook(props, context) {
  propsHook.call(this, props, context);
  this.componentWillReceiveProps = multihook([
    propsHook,
    this.componentWillReceiveProps || 'componentWillReceiveProps'
  ]);
  this.render = multihook([
    propsHook,
    beforeRender,
    this.render || 'render',
    afterRender
  ]);
}

function callMethod(ctx, m, args) {
  if (typeof m === 'string') {
    m = ctx.constructor.prototype[m];
  }
  if (typeof m === 'function') {
    return m.apply(ctx, args);
  }
}

function multihook(hooks, skipDuplicates) {
  return function() {
    let ret;
    for (let i = 0; i < hooks.length; i++) {
      let r = callMethod(this, hooks[i], arguments);

      if (skipDuplicates && r != null) {
        if (!ret) ret = {};
        for (let key in r)
          if (r.hasOwnProperty(key)) {
            ret[key] = r[key];
          }
      } else if (typeof r !== 'undefined') ret = r;
    }
    return ret;
  };
}

function propsHook(props, context) {
  if (!props) return;

  // React annoyingly special-cases single children, and some react components are ridiculously strict about this.
  let c = props.children;
  if (c && Array.isArray(c) && c.length === 1) {
    props.children = c[0];

    // but its totally still going to be an Array.
    if (props.children && typeof props.children === 'object') {
      props.children.length = 1;
      props.children[0] = props.children;
    }
  }

  // add proptype checking
  if (DEV) {
    let ctor = typeof this === 'function' ? this : this.constructor;
    let propTypes = this.propTypes || ctor.propTypes;
    const displayName = this.displayName || ctor.name;

    if (propTypes) {
      PropTypes.checkPropTypes(propTypes, props, 'prop', displayName);
    }
  }
}

function beforeRender(props) {
  currentComponent = this;
}

function afterRender() {
  if (currentComponent === this) {
    currentComponent = null;
  }
}

function Component(props, context, opts) {
  RaxComponent.call(this, props, context);
  this.state = this.getInitialState ? this.getInitialState() : {};
  this.refs = {};
  this._refProxies = {};
  if (opts !== BYPASS_HOOK) {
    newComponentHook.call(this, props, context);
  }
}

function bindAll(ctx) {
  for (let i in ctx) {
    let v = ctx[i];
    if (
      typeof v === 'function' &&
      !v.__bound &&
      !AUTOBIND_BLACKLIST.hasOwnProperty(i)
    ) {
      (ctx[i] = v.bind(ctx)).__bound = true;
    }
  }
}

function extend(base, props) {
  for (let key in props) {
    if (props.hasOwnProperty(key)) {
      base[key] = props[key];
    }
  }
  return base;
}

// apply a mapping of Arrays of mixin methods to a component prototype
function applyMixins(proto, mixins) {
  for (let key in mixins)
    if (mixins.hasOwnProperty(key)) {
      proto[key] = multihook(
        mixins[key].concat(proto[key] || []),
        key === 'getDefaultProps' ||
          key === 'getInitialState' ||
          key === 'getChildContext'
      );
    }
}

// Flatten an Array of mixins to a map of method name to mixin implementations
function collateMixins(mixins) {
  let keyed = {};
  for (let i = 0; i < mixins.length; i++) {
    let mixin = mixins[i];
    for (let key in mixin) {
      if (mixin.hasOwnProperty(key) && typeof mixin[key] === 'function') {
        (keyed[key] || (keyed[key] = [])).push(mixin[key]);
      }
    }
  }
  return keyed;
}
function F() {}
function createClass(obj) {
  function cl(props, context) {
    bindAll(this);
    Component.call(this, props, context, BYPASS_HOOK);
    newComponentHook.call(this, props, context);
  }

  obj = extend({constructor: cl}, obj);

  // We need to apply mixins here so that getDefaultProps is correctly mixed
  if (obj.mixins) {
    applyMixins(obj, collateMixins(obj.mixins));
  }
  if (obj.statics) {
    extend(cl, obj.statics);
  }
  if (obj.propTypes) {
    cl.propTypes = obj.propTypes;
  }
  if (obj.defaultProps) {
    cl.defaultProps = obj.defaultProps;
  }
  if (obj.getDefaultProps) {
    cl.defaultProps = obj.getDefaultProps();
  }

  F.prototype = Component.prototype;
  cl.prototype = extend(new F(), obj);

  cl.displayName = obj.displayName || 'Component';

  return cl;
}

export default createClass;
