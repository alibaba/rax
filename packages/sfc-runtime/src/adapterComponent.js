import SFC from './sfc';
import renderHelpers from 'render-helpers';
import { mixinSlots, proxy } from './mixin';
import convertComponentsDefining from './convertComponentsDefining';
import lifecyclesMap from './lifecyclesMap';
import nextTick from './nextTick';
import { isWeex } from './utils';

export default function adapterComponent(defining, renderFactory, styles, Rax) {
  // Set Rax as render
  renderHelpers._r(Rax);

  if (defining.components) {
    /**
     * Compatible to commonjs2
     */
    Object.keys(defining.components).forEach((componentName) => {
      const componentDeclear = defining.components[componentName];
      if (componentDeclear.__esModule === true
        && typeof componentDeclear.default === 'function') {
        defining.components[componentName] = componentDeclear.default;
      }
    });

    /**
     * Convert component defining name
     * - MyComponentName(PascalCase) => my-component-name(kebab-case)
     */
    convertComponentsDefining(defining.components);
  } else {
    /**
     * Must have a components object scope for doing
     *   _c(components['view'] || 'view')
     */
    defining.components = {};
  }

  const isCSSTextMode = typeof styles === 'string';
  const renderLifecycle = renderFactory(styles, defining, renderHelpers, isWeex);

  return class extends Rax.Component {
    constructor(props, context) {
      super(props, context);

      const vm = this.vm = new SFC({
        ...defining,
        propsData: props,
        children: props.children,
      });
      proxy(vm, '$refs', this, 'refs');

      // Bind mount related life cycles to Rax.
      const fns = Object.keys(lifecyclesMap);
      for (let i = 0, l = fns.length; i < l; i++) {
        if (typeof defining[fns[i]] === 'function') {
          this[lifecyclesMap[fns[i]]] = defining[fns[i]].bind(vm);
        }
      }

      // Fire destroyed at next tick
      if (typeof defining.destroyed === 'function') {
        const prevComponentWillUnmount = this.componentWillUnmount;
        this.componentWillUnmount = function() {
          prevComponentWillUnmount && prevComponentWillUnmount.call(this);
          nextTick(defining.destroyed, vm);
        };
      }

      const prevComponentWillReceiveProps = this.componentWillReceiveProps;
      this.componentWillReceiveProps = function(nextProps) {
        prevComponentWillReceiveProps && prevComponentWillReceiveProps.apply(vm, arguments);

        if (nextProps !== this.props && vm.hasOwnProperty('_props')) {
          // update propsData
          let keys = Object.keys(nextProps);
          for (let i = 0, l = keys.length; i < l; i++) {
            const prop = keys[i];
            if (vm._props.hasOwnProperty(prop) && vm._props[prop] !== nextProps[prop]) {
              vm[prop] = nextProps[prop];
            }
          }
        }

        if (nextProps.children !== this.props.children) {
          // update slots
          mixinSlots(vm, nextProps.children);
        }
      };

      /* @overrides forceUpdate */
      vm.forceUpdate = this.forceUpdate.bind(this);
      /* @overrides render */
      this.render = function() {
        const VTree = renderLifecycle.call(vm);

        // Inject style tag, if CSS text mode enables.
        if (isCSSTextMode && styles.length > 0) {
          return [Rax.createElement('style', null, styles), VTree];
        } else {
          return VTree;
        }
      };
    }
  };
}
