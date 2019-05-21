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
  const instance = new Klass({}, null);
  const { prototype: klassPrototype, defaultProps } = Klass;
  const { props, state } = instance;
  const classMethods = Object.getOwnPropertyNames(klassPrototype);
  const initData = Object.assign({}, defaultProps, props, state);
  const pageConfig = {
    data: initData,
    state: initData,
    props: Object.assign({}, props, defaultProps),
    onLoad(query) {
      // TODO: set query to component instance.
      klassPrototype.componentWillMount &&
        klassPrototype.componentWillMount.call(this);
    },
    onShow() {
      klassPrototype.onShow &&
        klassPrototype.onShow.call(this);
    },
    onReady() {
      klassPrototype.componentDidMount &&
        klassPrototype.componentDidMount.call(this);
    },
    onHide() {
      klassPrototype.onHide &&
        klassPrototype.onHide.call(this);
    },
    onUnload() {
      klassPrototype.componentWillUnmount &&
        klassPrototype.componentWillUnmount.call(this);
    },
    onReachBottom() {
      klassPrototype.onReachBottom && klassPrototype.onReachBottom.call(this);
    },
    onShareAppMessage(options) {
      klassPrototype.onShareAppMessage &&
        klassPrototype.onShareAppMessage.call(this, options);
    },
    setState,
    forceUpdate,
  };
  for (let i = 0, l = classMethods.length; i < l; i++) {
    const methodName = classMethods[i];
    const fn = klassPrototype[methodName];
    if ('constructor' === methodName) continue;
    if (PAGE_EVENTS.indexOf(methodName) > -1) {
      pageConfig.events[methodName] = fn;
    } else if (typeof klassPrototype[methodName] === 'function') {
      pageConfig[methodName] = fn;
    }
  }
  return pageConfig;
}

/**
 * Bridge setState directly to setData. `this` is bound to component instance.
 * @param particialState {Object|Function}
 * @param callback? {Function}
 */
export function setState(particialState, callback) {
  return this.setData(particialState, callback);
}
/**
 * Bridge to forceUpdate.
 * @param callback? {Function}
 */
export function forceUpdate(callback) {
  return setState.call(this, {}, callback);
}
