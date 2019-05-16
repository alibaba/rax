import { setState, forceUpdate, hasOwn } from './common/utils';
import { pageEventHandleList, pageCycleList} from './common/cycle-config';
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
  const initData = Object.assign({}, defaultProps, props, state)
  const pageConfig = {
    data: initData,
    onLoad(query) {
      const app = getApp();
      // todo: set query
      klassPrototype.componentWillMount && klassPrototype.componentWillMount()
    },
    onShow() {
      klassPrototype.componentOnShow && klassPrototype.componentOnShow()
    },
    onReady() {
      klassPrototype.componentDidMount && klassPrototype.componentDidMount()
    },
    onHide() {
      klassPrototype.componentOnHide && klassPrototype.componentOnHide()
    },
    onUnload() {
      klassPrototype.componentWillUnmount && klassPrototype.componentWillUnmount()
    },
    onReachBottom() {
      klassPrototype.componentWillUnmount && klassPrototype.onReachBottom()
    },
    onShareAppMessage(options) {
      klassPrototype.componentWillUnmount && klassPrototype.onShareAppMessage(options)
    },
    setState,
    forceUpdate
  }
  for (let i = 0, l = classMethods.length; i < l; i++) {
    const methodName = classMethods[i];
    const fn = klassPrototype[methodName];
    if ('constructor' === methodName) continue;
    if (pageEventHandleList.includes(methodName)) {
        pageConfig.events[methodName] = fn;
    }
    if (typeof klassPrototype[methodName] === 'function' && !(pageCycleList.includes(methodName))) {
      pageConfig[methodName] = fn;
    }
  }
  return pageConfig;
}
