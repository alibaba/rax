import {
  mixinComputed,
  mixinProps,
  mixinSlots,
  mixinData,
  proxy,
} from './mixin';
import initWatch from './initWatch';

const lifecyclesMap = {
  beforeMount: 'componentWillMount',
  mounted: 'componentDidMount',
  beforeUpdate: 'componentWillUpdate',
  updated: 'componentDidUpdate',
  beforeDestroy: 'componentWillUnmount',
};

export default class SFC {
  constructor(config) {
    // life cycle: before create
    if (typeof config.beforeCreate === 'function') {
      config.beforeCreate.call(null);
    }

    this._data = {};
    Object.defineProperty(this, '_watchers', {
      enumerable: false,
      value: [],
    });

    if (config._global) {
      Object.defineProperty(this, '_global', {
        enumerable: false,
        value: config._global,
      });
    }

    // 1. _watchers
    // 2. props
    // 3. methods
    // 4. data & observe
    // 5. computed
    // 6. watch
    mixinProps(this, config.props);
    // mixin methods
    if (config.methods) {
      Object.keys(config.methods).forEach(methodName => {
        this[methodName] = config.methods[methodName].bind(this);
      });
    }

    // mixin data
    mixinData(this, config);

    Object.defineProperty(this, '$options', {
      enumerable: false,
      configurable: true,
      get() {
        return config;
      },
    });
    // proxy $data, $props
    proxy(this, 'props', this, '$props');
    proxy(this, 'refs', this, '$refs');

    mixinComputed(this, config.computed);

    initWatch(this, config.watch);

    // fire created
    if (typeof config.created === 'function') {
      config.created.call(this);
    }

    // bind other life cycle
    const fns = Object.keys(lifecyclesMap);
    for (let i = 0, l = fns.length; i < l; i++) {
      if (typeof config[fns[i]] === 'function') {
        this[lifecyclesMap[fns[i]]] = config[fns[i]].bind(this);
      }
    }

    // fire destroyed at next tick
    if (typeof config.destroyed === 'function') {
      const prevComponentWillUnmount = this.componentWillUnmount;
      this.componentWillUnmount = function() {
        prevComponentWillUnmount &&
          prevComponentWillUnmount.call(this);
        setTimeout(() => {
          config.destroyed.apply(this, arguments);
        });
      };
    }

    const prevComponentWillReceiveProps = this
      .componentWillReceiveProps;
    this.componentWillReceiveProps = function(nextProps) {
      prevComponentWillReceiveProps &&
        prevComponentWillReceiveProps.apply(this, arguments);
      if (nextProps.children !== this.props.children) {
        // update slots
        mixinSlots(this, nextProps.children);
      }
    };
  }

  /**
   * @need overrides
   * render not impled
   */
  render() {
    return null;
  }
}
