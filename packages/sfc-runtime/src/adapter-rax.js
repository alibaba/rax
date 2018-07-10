import {
  mixinComputed,
  mixinProps,
  mixinSlots,
  mixinData,
  proxy
} from './mixin';
import lifeCycleFn from './lifeCycleFn';
import renderHelpers from './vdom';
import componentName from './components-name';
import initWatch from './initWatch';
import { set as storeSet } from './store';

export default function adapterRaxComponent(def, _renderFn, $_style, rax) {
  const { createElement, Component, render } = rax;
  storeSet('c', createElement);

  const renderFn = _renderFn($_style, def, renderHelpers);

  componentName(def);
  function RaxComponent(props, context) {
    const self = this;

    // life cycle: before create
    if (typeof def.beforeCreate === 'function') {
      def.beforeCreate.call(null);
    }

    const possiblilyReturned = Component.apply(this, arguments);
    this.props = Object.assign({}, props);

    // vm: view-model proxy all
    const vm = this.vm = {};
    Object.defineProperty(vm, '_watchers', {
      enumerable: false,
      value: []
    });

    if (def._global) {
      Object.defineProperty(vm, '_global', {
        enumerable: false,
        value: def._global
      });
    }

    // 1. _watchers
    // 2. props
    // 3. methods
    // 4. data & observe
    // 5. computed
    // 6. watch
    mixinProps(vm, props, def.props);
    // mixin methods
    if (def.methods) {
      Object.keys(def.methods).forEach(methodName => {
        vm[methodName] = def.methods[methodName].bind(vm);
      });
    }

    // mixin data
    mixinData(this, def);
    mixinSlots(vm, props.children);

    Object.defineProperty(vm, '$options', {
      enumerable: false,
      configurable: true,
      get() {
        return def;
      }
    });
    // proxy $data, $props
    proxy(vm, '$data', this, '_data');
    proxy(vm, '$props', this, 'props');
    proxy(vm, '$refs', this, 'refs');

    mixinComputed(vm, def.computed);

    if (def.watch) {
      initWatch(vm, def.watch);
    }

    // fire created
    if (typeof def.created === 'function') {
      def.created.call(vm);
    }

    // bind other life cycle
    const fns = Object.keys(lifeCycleFn);
    for (let i = 0, l = fns.length; i < l; i++) {
      if (typeof def[fns[i]] === 'function') {
        this[lifeCycleFn[fns[i]]] = def[fns[i]].bind(vm);
      }
    }

    // fire destroyed at next tick
    if (typeof def.destroyed === 'function') {
      const prevComponentWillUnmount = this.componentWillUnmount;
      this.componentWillUnmount = function() {
        prevComponentWillUnmount && prevComponentWillUnmount.call(this);
        setTimeout(() => {
          def.destroyed.apply(vm, arguments);
        });
      };
    }

    const prevComponentWillReceiveProps = this.componentWillReceiveProps;
    this.componentWillReceiveProps = function(nextProps) {
      prevComponentWillReceiveProps &&
        prevComponentWillReceiveProps.apply(this, arguments);
      if (nextProps.children !== this.props.children) {
        // update slots
        mixinSlots(vm, nextProps.children);
      }
    };

    // register render
    this.render = renderFn.bind(vm);
    return possiblilyReturned;
  }

  RaxComponent.prototype = Object.create(Component && Component.prototype, {
    constructor: {
      value: RaxComponent,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  RaxComponent.__proto__ = Component;
  return RaxComponent;
}
