const PAGE_EVENTS = [
  'onBack',
  'onKeyboardHeight',
  'onOptionMenuClick',
  'onPopMenuClick',
  'onPullIntercept',
  'onPullDownRefresh',
  'onTitleClick',
  'onTabItemTap',
  'beforeTabItemTap',
  'onResize'
];

/**
 * Bridge from Rax page component class to MiniApp Component constructor.
 * @param Klass {RaxComponent} Rax page component.
 * @return {Object} MiniApp Page constructor's config.
 */
export function createPage(Klass) {
  const { prototype: klassPrototype, defaultProps } = Klass;
  const props = klassPrototype.props = klassPrototype.props || {};
  const instance = new Klass(props, null);
  const data = Object.assign({}, defaultProps, props, instance.state);
  let _internal; // AppX Page instance object.

  function invokeMethod(method, args = []) {
    if (typeof instance[method] === 'function') {
      return instance[method].apply(instance, args);
    }
  }

  const { methods, events } = getClassMethods(Klass);
  const config = {
    data,
    events,
    props: Object.assign({}, props, defaultProps),

    /**
     * Bridge setState directly to setData. `this` is bound to component instance.
     * @param particialState {Object|Function}
     * @param callback? {Function}
     */
    setState(particialState, callback) {
      if (typeof instance.render === 'function') {
        const dynamicState = instance.render();
        return this.setData(Object.assign({}, particialState, dynamicState), callback);
      } else {
        return this.setData(particialState, callback);
      }
    },

    /**
     * Bridge to forceUpdate.
     * @param callback? {Function}
     */
    forceUpdate(callback) {
      return this.setState({}, callback);
    },

    onLoad(query) {
      _internal = this;
      props.query = query;

      invokeMethod('componentWillMount');
      this.forceUpdate(); // Call render.
    },
    onShow() {
      invokeMethod('onShow');
    },
    onReady() {
      invokeMethod('componentDidMount');
    },
    onHide() {
      invokeMethod('onHide');
    },
    onUnload() {
      invokeMethod('componentWillUnmount');
    },
    onReachBottom() {
      invokeMethod('onReachBottom');
    },
    onShareAppMessage(options) {
      return invokeMethod('onShareAppMessage', [options]);
    },
  };

  return Object.assign(config, methods);
}

function getClassMethods(Klass) {
  const { prototype: klassPrototype } = Klass;
  const classMethods = Object.getOwnPropertyNames(klassPrototype);
  const events = {};
  const methods = {};
  for (let i = 0, l = classMethods.length; i < l; i++) {
    const methodName = classMethods[i];
    const fn = klassPrototype[methodName];
    if ('constructor' === methodName) continue;
    if (PAGE_EVENTS.indexOf(methodName) > -1) {
      events[methodName] = fn;
    } else if (typeof klassPrototype[methodName] === 'function') {
      methods[methodName] = fn;
    }
  }
  return { events, methods };
}
