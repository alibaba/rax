import Component from './component';

const AUTOBIND_BLACKLIST = {
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

function collateMixins(mixins) {
  let keyed = {};

  for (let i = 0; i < mixins.length; i++) {
    let mixin = mixins[i];
    if (mixin.mixins) {
      applyMixins(mixin, collateMixins(mixin.mixins));
    }

    for (let key in mixin) {
      if (mixin.hasOwnProperty(key) && key !== 'mixins') {
        (keyed[key] || (keyed[key] = [])).push(mixin[key]);
      }
    }
  }

  return keyed;
}

function flattenHooks(key, hooks) {
  let hookType = typeof hooks[0];
  if (hookType === 'object') {
    // Merge objects
    hooks.unshift({});
    return Object.assign.apply(null, hooks);
  } else if (hookType === 'function') {
    return function() {
      let ret;
      for (let i = 0; i < hooks.length; i++) {
        let r = hooks[i].apply(this, arguments);
        if (r && (key === 'getInitialState' || key === 'getDefaultProps' || key === 'getChildContext')) {
          if (!ret) ret = {};
          Object.assign(ret, r);
        }
      }
      return ret;
    };
  } else {
    return hooks[0];
  }
}

function applyMixins(proto, mixins) {
  for (let key in mixins) {
    if (mixins.hasOwnProperty(key)) {
      proto[key] = flattenHooks(key, mixins[key].concat(proto[key] || []));
    }
  }
}

function createReactClass(spec) {
  class ReactClass extends Component {
    constructor(props, context) {
      super(props, context);

      for (let methodName in this) {
        let method = this[methodName];
        if (typeof method === 'function' && !AUTOBIND_BLACKLIST[methodName]) {
          this[methodName] = method.bind(this);
        }
      }

      if (spec.getInitialState) {
        this.state = spec.getInitialState.call(this);
      }
    }
  }

  if (spec.mixins) {
    applyMixins(spec, collateMixins(spec.mixins));
  }

  Object.assign(ReactClass.prototype, spec);

  if (spec.statics) {
    Object.assign(ReactClass, spec.statics);
  }

  if (spec.propTypes) {
    ReactClass.propTypes = spec.propTypes;
  }

  if (spec.getDefaultProps) {
    ReactClass.defaultProps = spec.getDefaultProps();
  }

  if (spec.contextTypes) {
    ReactClass.contextTypes = spec.contextTypes;
  }

  if (spec.childContextTypes) {
    ReactClass.childContextTypes = spec.childContextTypes;
  }

  if (spec.displayName) {
    ReactClass.displayName = spec.displayName;
  }

  return ReactClass;
}

export default createReactClass;
