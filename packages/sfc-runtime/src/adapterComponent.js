import {
  mixinComputed,
  mixinProps,
  mixinSlots,
  mixinData,
  proxy
} from './mixin';
import renderHelpers from './vdom';
import initWatch from './initWatch';
import { isWeex, kebabCase } from './utils';
import { set as storeSet } from './store';

const lifecyclesMap = {
  beforeMount: 'componentWillMount',
  mounted: 'componentDidMount',
  beforeUpdate: 'componentWillUpdate',
  updated: 'componentDidUpdate',
  beforeDestroy: 'componentWillUnmount'
};

// When defining a component with PascalCase like MyComponentName,
// you can use either case when referencing its custom element.
// That means both <my-component-name> and <MyComponentName> are acceptable.
function convertComponentsDefining(defining) {
  if (defining.components) {
    const names = Object.keys(defining.components);
    for (let i = 0, l = names.length; i < l; i++) {
      if (/[A-Z]/.test(names[i][0])) {
        const camelCase = names[i][0].toLowerCase() + names[i].slice(1);
        defining.components[camelCase] = defining.components[names[i]];
      }
      const kebabName = kebabCase(names[i]);
      defining.components[kebabName] = defining.components[names[i]];
    }
  }
}

/**
 * registed global components
 */
const globalComponents = typeof __sfc_global_components__ === 'object' ? __sfc_global_components__ : null; // eslint-disable-line

export default function adapterComponent(defining, renderFactory, styles, Rax) {
  const { createElement, Component } = Rax;
  storeSet('c', createElement);

  defining.components = defining.components || {};
  // compatible to commonjs2
  Object.keys(defining.components).forEach((componentName) => {
    const componentDeclear = defining.components[componentName];
    if (componentDeclear.__esModule === true
      && typeof componentDeclear.default === 'function') {
      defining.components[componentName] = componentDeclear.default;
    }
  });

  if (globalComponents) {
    Object.assign(defining.components, globalComponents);
  }

  const renderLifecycle = renderFactory(styles, defining, renderHelpers, isWeex);

  // MyComponentName(PascalCase) => my-component-name(kebab-case)
  convertComponentsDefining(defining);

  return class extends Component {
    constructor(props, context) {
      super(props, context);

      // life cycle: before create
      if (typeof defining.beforeCreate === 'function') {
        defining.beforeCreate.call(null);
      }

      this.props = Object.assign({}, props);

      // vm: view-model proxy all
      const vm = this._data = {};
      Object.defineProperty(vm, '_watchers', {
        enumerable: false,
        value: []
      });

      if (defining._global) {
        Object.defineProperty(vm, '_global', {
          enumerable: false,
          value: defining._global
        });
      }

      // 1. _watchers
      // 2. props
      // 3. methods
      // 4. data & observe
      // 5. computed
      // 6. watch
      mixinProps(vm, props, defining.props);
      // mixin methods
      if (defining.methods) {
        Object.keys(defining.methods).forEach(methodName => {
          vm[methodName] = defining.methods[methodName].bind(vm);
        });
      }

      // mixin data
      mixinData(this, defining);
      mixinSlots(vm, props.children);

      Object.defineProperty(vm, '$options', {
        enumerable: false,
        configurable: true,
        get() {
          return defining;
        }
      });
      // proxy $data, $props
      proxy(this, '_data', this, '$data');
      proxy(vm, '$props', this, 'props');
      proxy(vm, '$refs', this, 'refs');

      mixinComputed(vm, defining.computed);

      if (defining.watch) {
        initWatch(vm, defining.watch);
      }

      // fire created
      if (typeof defining.created === 'function') {
        defining.created.call(vm);
      }

      // bind other life cycle
      const fns = Object.keys(lifecyclesMap);
      for (let i = 0, l = fns.length; i < l; i++) {
        if (typeof defining[fns[i]] === 'function') {
          this[lifecyclesMap[fns[i]]] = defining[fns[i]].bind(vm);
        }
      }

      // fire destroyed at next tick
      if (typeof defining.destroyed === 'function') {
        const prevComponentWillUnmount = this.componentWillUnmount;
        this.componentWillUnmount = function() {
          prevComponentWillUnmount && prevComponentWillUnmount.call(this);
          setTimeout(() => {
            defining.destroyed.apply(vm, arguments);
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
      this.render = renderLifecycle.bind(vm);
    }
  };
}
