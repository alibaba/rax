/**
 * interface of mp page
 */
class Page {
  constructor(vnode, config) {
    this.vnode = vnode;

    // copy methods and other keys
    Object.keys(config).forEach(key => {
      if (typeof config[key] === 'function') {
        this[key] = config[key].bind(this);
      } else {
        this[key] = config[key];
      }
    });
  }
  get data() {
    return this.vnode.state;
  }
  set data(val) {
    // warn: not commanded usage of assigning state directly
    this.vnode.state = val;
  }
  setData(...args) {
    return this.vnode.setState(...args);
  }
}

/**
 * 返回页面级别的 RaxComponent
 * @param {Object} config 用户传入 `Page(config)` 方法的参数
 * @param {Function} renderFactory
 * @param {Function} mpRequire MiniApp Framework 提供的 require 方法
 * @returns {Rax.Component} PageComponent 匿名页面组件
 */
export default function pageComponentFactory(config = {}, renderFactory, mpRequire) {
  // 存储页面实例相关变量的对象，每个页面有独立的 clientId 和 pageName 不能共享
  const pageContextInfo = mpRequire('@core/context');
  const pageEventEmitter = mpRequire('@core/page');
  const { pageName, clientId, Rax } = pageContextInfo;

  const createVDOM = renderFactory();
  return class MPPageComponent extends Rax.Component {
    constructor(props, context) {
      super(props, context);

      // 面向开发者的 `this`, Page 的实例
      this.pageInstance = new Page(this, config);

      const { data, onLoad, onReady, onHide, onUnload, onPageScroll } = config;

      if (data) this.state = data;

      // 页面加载时触发, 一个页面只会调用一次，在 onLoad 的参数中获取打开当前页面路径中的参数
      if (isFn(onLoad)) {
        onLoad.call(this.pageInstance, pageContextInfo.pageQuery);
      }
      if (isFn(onReady)) {
        pageEventEmitter.on('ready', onReady.bind(this.pageInstance));
      }
      if (isFn(onHide)) {
        pageEventEmitter.on('hide', onHide.bind(this.pageInstance));
      }
      if (isFn(onUnload)) {
        pageEventEmitter.on('unload', onUnload.bind(this.pageInstance));
      }
      // pageScroll 需要监听 document.body 节点的 scroll 事件
      if (isFn(onPageScroll) && pageContextInfo.document) {
        pageContextInfo.document.body.addEventListener('scroll', onPageScroll.bind(this.pageInstance));
      }
    }

    componentWillMount() {
      // hack: 当前 Native 触发 show 的时机比较早，第一次 onShow 需手动触发
      const { onShow } = config;
      if (isFn(onShow)) {
        onShow.call(this.pageInstance);
        pageEventEmitter.on('show', onShow.bind(this.pageInstance));
      }
    }

    render() {
      return createVDOM.call(this.pageInstance, this.pageInstance.data);
    }
  };
}

function isFn(val) {
  return 'function' === typeof val;
}
