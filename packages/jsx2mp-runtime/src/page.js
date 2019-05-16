import { setState, forceUpdate, hasOwn } from './common/utils';
import { pageEventHandleList, pageCycleList } from './common/cycleConfig';
/**
 * Bridge from RaxPageComponent Klass to MiniApp RaxPageComponent constructor.
 * @param Klass {RaxPageComponent}
 * @return {Object} MiniApp Page constructor's config.
 */
export function createPage(Klass) {
  const _page = new Klass({}, null);
  const { prototype: klassPrototype, defaultProps } = Klass;
  const { props, state } = _page;
  const classMethods = Object.getOwnPropertyNames(klassPrototype);
  const initData = Object.assign({}, defaultProps, props, state);
  const pageConfig = {
    data: initData,
    state: initData,
    props: Object.assign({}, props, defaultProps),
    onLoad(query) {
      // todo: set query
      klassPrototype.componentWillMount &&
        klassPrototype.componentWillMount.call(this);
    },
    onShow() {
      klassPrototype.componentOnShow &&
        klassPrototype.componentOnShow.call(this);
    },
    onReady() {
      klassPrototype.componentDidMount &&
        klassPrototype.componentDidMount.call(this);
    },
    onHide() {
      klassPrototype.componentOnHide &&
        klassPrototype.componentOnHide.call(this);
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
    forceUpdate
  };
  for (let i = 0, l = classMethods.length; i < l; i++) {
    const methodName = classMethods[i];
    const fn = klassPrototype[methodName];
    if ('constructor' === methodName) continue;
    if (pageEventHandleList.includes(methodName)) {
      pageConfig.events[methodName] = fn;
    }
    if (
      typeof klassPrototype[methodName] === 'function' &&
      !pageCycleList.includes(methodName)
    ) {
      pageConfig[methodName] = fn;
    }
  }
  return pageConfig;
}
