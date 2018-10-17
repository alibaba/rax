import SFC from './sfc';
import renderHelpers from './vdom';
import { isWeex } from './utils';
import Host from './host';
import { mixinSlots, proxy } from './mixin';
import convertComponentsDefining from './convertComponentsDefining';
import getGlobalComponents from './getGlobalComponents';
import lifecyclesMap from './lifecyclesMap';
import nextTick from './nextTick';

export default function adapterComponent(defining, renderFactory, styles, Rax) {
  const { createElement, Component } = Rax;
  Host.createElement = createElement;

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

    /**
     * Register global components
     */
    let globalComponents = getGlobalComponents();
    if (globalComponents) Object.assign(defining.components, globalComponents);
  } else {
    /**
     * Must have a components object scope for doing
     *   _c(components['view'] || 'view')
     */
    defining.components = {};
  }

  const renderLifecycle = renderFactory(styles, defining, renderHelpers, isWeex);

  return class extends Component {
    constructor(props, context) {
      super(props, context);

      const vm = this.vm = new SFC({
        ...defining,
        propsData: props,
        children: props.children,
      });
      proxy(vm, '$refs', this, 'refs');

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
