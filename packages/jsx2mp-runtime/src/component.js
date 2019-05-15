const INSTANCE = '__rax_instance__';
const CYCLE_MAP = {
  componentDidMount: 'didMount',
  componentWillReceiveProps: 'didUpdate',
  componentWillUnmount: 'didUnmount',
};

function hasOwn(object, prop) {
  return Object.hasOwnProperty.call(object, prop);
}

/**
 * Bridge setState directly to setData. `this` is bound to component instance.
 * @param particialState {Object|Function}
 * @param callback? {Function}
 */
function setState(particialState, callback) {
  return this.setData(particialState, callback);
}

/**
 * Bridge to forceUpdate.
 * @param callback? {Function}
 */
function forceUpdate(callback) {
  return setState.call(this, {}, callback);
}

const methods = {
  setState,
  forceUpdate,
};

/**
 * Bridge from RaxComponent Klass to MiniApp Component constructor.
 * @param exported {RaxComponent}
 * @param isFunctionComponent {Boolean}
 * @return {Object} MiniApp Component constructor's first arg.
 */
export function createComponent(exported, isFunctionComponent = false) {
  if (isFunctionComponent) {
    const config = {
      didMount() {
        this.setData(exported.call(this, this.props, this.data));
      },
      methods,
    };
    return config;
  } else {
    const { prototype: klassPrototype, mixins, defaultProps } = exported;

    /**
     * Expose config of component.
     */
    const config = {
      mixins,
      props: defaultProps,
      data() {
        const instance = new exported({}, null);
        config[INSTANCE] = instance;
        return instance.state;
      },
      methods,
    };

    /**
     * Bind function class methods into methods or cycles.
     */
    const classMethods = Object.getOwnPropertyNames(klassPrototype);
    for (let i = 0, l = classMethods.length; i < l; i++) {
      const methodName = classMethods[i];
      if ('constructor' === methodName) continue;

      if (typeof klassPrototype[methodName] === 'function') {
        const fn = klassPrototype[methodName];
        if (hasOwn(CYCLE_MAP, methodName)) {
          config[CYCLE_MAP[methodName]] = fn;
        } else {
          config.methods[methodName] = fn;
        }
      }
    }

    return config;
  }
}
