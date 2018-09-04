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

export default function createPage(config = {}, renderFactory, getCoreModule) {
  // each page has unique vars that can not be shared
  const pageContext = getCoreModule('@core/context');
  const pageEventEmitter = getCoreModule('@core/page');
  const { document, pageQuery, pageName, Rax } = pageContext;

  const createVDOM = renderFactory();
  return class extends Rax.Component {
    constructor(props, context) {
      super(props, context);

      // create Page instance, initialize data and setData
      this.pageInstance = new Page(this, config);

      const { data, onLoad, onReady, onHide, onUnload, onPageScroll } = config;

      if (data) this.state = data;

      // trigger while loaded，pageQuery passed to cycle
      if ('function' === typeof onLoad) {
        onLoad.call(this.pageInstance, pageQuery);
      }
      if ('function' === typeof onReady) {
        const cycleFn = onReady.bind(this.pageInstance);
        this.cycleListeners.push({ type: 'ready', fn: cycleFn });
        pageEventEmitter.on('ready', cycleFn);
      }
      if ('function' === typeof onHide) {
        const cycleFn = onHide.bind(this.pageInstance);
        this.cycleListeners.push({ type: 'hide', fn: cycleFn });
        pageEventEmitter.on('hide', cycleFn);
      }
      if ('function' === typeof onUnload) {
        const cycleFn = onUnload.bind(this.pageInstance);
        this.cycleListeners.push({ type: 'unload', fn: cycleFn });
        pageEventEmitter.on('unload', cycleFn);
      }
      // listen to pageScroll
      if ('function' === typeof onPageScroll && document) {
        document.body.addEventListener('scroll', onPageScroll.bind(this.pageInstance));
      }
    }

    // type: [{ type, fn }]
    // remember cycle to remove while being destroyed
    cycleListeners = [];

    componentWillMount() {
      // native event of first show triggered too ealier,
      // triggering by willMount
      const { onShow } = config;
      if ('function' === typeof onShow) {
        onShow.call(this.pageInstance);
        const cycleFn = onShow.bind(this.pageInstance);
        this.cycleListeners.push({ type: 'show', fn: cycleFn });
        pageEventEmitter.on('show', cycleFn);
      }

      // update vdom while toggle show/hide
      this.cycleListeners.push({ type: 'show', fn: this.forceUpdate });
      pageEventEmitter.on('show', this.forceUpdate);

      // update page data by event
      this.cycleListeners.push({ type: 'updatePageData', fn: this.setState });
      pageEventEmitter.on('updatePageData', this.setState);
    }

    componentWillUnmount() {
      for (let i = 0, l = this.cycleListeners.length; i < l; i++) {
        pageEventEmitter.off(this.cycleListeners[i].type, this.cycleListeners[i].fn);
      }
    }

    render() {
      return createVDOM.call(this.pageInstance, this.pageInstance.data);
    }
  };
}
