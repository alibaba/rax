import SFC from './sfc';
import renderHelpers from './vdom';
import setRuntime from './vdom/setRuntime';
import { mixinSlots, proxy } from './mixin';
import convertComponentsDefining from './convertComponentsDefining';
import lifecyclesMap from './lifecyclesMap';
import nextTick from './nextTick';
import { isWeex } from './utils';

export default function adapterComponent(defining, renderFactory, styles, Rax) {
  setRuntime(Rax);

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
        if (nextProps.children !== this.props.children) {
          // update slots
          mixinSlots(vm, nextProps.children);
        }
      };

      /* @overrides forceUpdate */
      vm.forceUpdate = this.forceUpdate.bind(this);
      /* @overrides render */
      this.render = renderLifecycle.bind(vm);
    }
  };
}
