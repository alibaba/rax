import computeChangedData from './computeChangedData';

const WEBVIEW_MESSAGE_NAME = '__WEBVIEW_MESSAGE_EVENT_NAME__@';
const WEBVIEW_STYLE = { width: '100vw', height: '100vh' };

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

  /**
   * support string path like
   * - 'a[0].foo': 1
   * - a.b.c.d
   */
  setData(expData, callback) {
    if (expData == null) {
      return;
    }

    const changedData = computeChangedData(this.data, expData);

    // in case component is not mounted
    if (this.vnode.updater === undefined) {
      this.vnode.mergeState(changedData, callback);
    } else {
      this.vnode.setState(changedData, callback);
    }
  }
}

export default function createPage(config = {}, renderFactory, getCoreModule) {
  // each page has unique vars that can not be shared
  const pageContext = getCoreModule('@core/context');
  const pageEventEmitter = getCoreModule('@core/page');
  const Rax = getCoreModule('@core/rax');

  const { document, location, pageQuery, pageName } = pageContext;
  const { getWebViewSource, getWebViewOnMessage } = renderFactory;

  const render = getWebViewSource
    ? (data) => {
      const url = getWebViewSource(data);
      if (url && location && location.href !== url) {
        location.replace(url);
        return '';
      } else {
        return Rax.createElement('web-view', { src: url, style: WEBVIEW_STYLE });
      }
    }
    : renderFactory(null, Rax);
  return class extends Rax.Component {
    constructor(props, context) {
      super(props, context);

      // create Page instance, initialize data and setData
      this.pageInstance = new Page(this, config);
      /**
       * willMount: [fn],
       * didMount: [fn],
       * unMount: []
       */
      this.cycleHooks = {
        willMount: [],
        didMount: [],
        unMount: []
      };

      const { data, onLoad, onHide, onUnload, onPageScroll, onPullIntercept } = config;

      if (data) this.state = data;

      // trigger while loaded，pageQuery passed to cycle
      if ('function' === typeof onLoad) {
        onLoad.call(this.pageInstance, pageQuery);
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
      // onPullIntercept
      if ('function' === typeof onPullIntercept) {
        const cycleFn = onPullIntercept.bind(this.pageInstance);
        this.cycleListeners.push({ type: 'pullIntercept', fn: cycleFn });
        pageEventEmitter.on('pullIntercept', cycleFn);
      }

      // in web-view page
      if (getWebViewOnMessage) {
        const onMessageMethod = getWebViewOnMessage.call(this.pageInstance, this.state);
        if (typeof config[onMessageMethod] === 'function') {
          const cycleFn = (evt) => {
              config[onMessageMethod].call(this.pageInstance, { detail: { data: evt.data } });
          };
          this.cycleListeners.push({ type: WEBVIEW_MESSAGE_NAME, fn: cycleFn });
          pageEventEmitter.on(WEBVIEW_MESSAGE_NAME, cycleFn);
        }
      }
    }

    // type: [{ type, fn }]
    // remember cycle to remove while being destroyed
    cycleListeners = [];

    componentWillMount() {
      // native event of first show triggered too ealier,
      // triggering by didMount
      const { onShow, onReady } = config;
      if ('function' === typeof onShow) {
        onShow.call(this.pageInstance);
        const cycleFn = onShow.bind(this.pageInstance);
        this.cycleListeners.push({ type: 'show', fn: cycleFn });
        pageEventEmitter.on('show', cycleFn);
      }

      // ready event fired at componentWillMount by front end
      if ('function' === typeof onReady) {
        try {
          onReady.call(this.pageInstance);
        } catch (err) {
          console.error(err); // do not stuck willMount
        }
      }

      // update vdom while toggle show/hide
      const updatePageData = (pageData) => {
        this.pageInstance.setData(pageData);
      };
      this.cycleListeners.push({ type: 'show', fn: updatePageData });
      pageEventEmitter.on('show', updatePageData);

      // update page data by event
      this.cycleListeners.push({ type: 'updatePageData', fn: updatePageData });
      pageEventEmitter.on('updatePageData', updatePageData);

      this.runCycleHooks('willMount');
    }

    componentDidMount() {
      this.runCycleHooks('didMount');
    }

    componentWillUnmount() {
      for (let i = 0, l = this.cycleListeners.length; i < l; i++) {
        pageEventEmitter.off(this.cycleListeners[i].type, this.cycleListeners[i].fn);
      }
      this.runCycleHooks('unMount');
    }

    runCycleHooks(cycleName) {
      if (this.cycleHooks[cycleName] && this.cycleHooks[cycleName].length > 0) {
        let fn;
        while (fn = this.cycleHooks[cycleName].shift()) {
          fn();
        }
      }
    }

    /**
     * merge data to state
     * before first render
     */
    mergeState(data, callback) {
      if (data == null) {
        return;
      }

      this.state = {
        ...this.state,
        ...data
      };

      if (typeof callback === 'function') {
        if (this.updater) {
          callback.call(this.pageInstance);
        } else {
          this.cycleHooks.didMount.push(callback.bind(this.pageInstance));
        }
      }
    }

    render() {
      return render.call(this.pageInstance, this.pageInstance.data);
    }
  };
}
