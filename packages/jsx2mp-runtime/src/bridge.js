/* global PROPS */
// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickapp } from 'universal-env';
import { cycles as appCycles } from './app';
import Component from './component';
import { ON_SHOW, ON_HIDE, ON_LAUNCH, ON_ERROR, ON_PAGE_SCROLL, ON_SHARE_APP_MESSAGE, ON_REACH_BOTTOM, ON_PULL_DOWN_REFRESH, ON_TAB_ITEM_TAP, ON_TITLE_CLICK, ON_BACK_PRESS, ON_MENU_PRESS } from './cycles';
import { setComponentInstance, getComponentProps } from './updater';
import {
  getNativePageLifecycle,
  getNativeComponentLifecycle,
  getComponentBaseConfig,
  attachEvent,
  getId
} from './adapter/index';
import { createMiniAppHistory, getMiniAppHistory } from './history';
import { __updateRouterMap } from './router';
import { setPageInstance } from './pageInstanceMap';
import { registerEventsInConfig } from './nativeEventListener';

const GET_DERIVED_STATE_FROM_PROPS = 'getDerivedStateFromProps';
let _appConfig;
let _pageProps = {};

/**
 * Reference relationship.
 * page/component instance          Rax instance
 *    instance    -------------->      *self
 *      *self     <--------------   _internal
 *      props     <----getter----     props
 *      data      <----getter----     state
 *    setData     <--------------    setState
 */
function getPageCycles(Klass) {
  let config = getNativePageLifecycle({
    mount(options) {
      // Ensure page has loaded
      const history = createMiniAppHistory();
      const { instanceId, props } = generateBaseOptions(this, Klass.defaultProps, {
        history,
        location: history.location
      }, _pageProps);
      this.instance = new Klass(props);
      // Reverse sync from state to data.
      this.instance.instanceId = instanceId;
      setPageInstance(this.instance);
      this.instance._internal = this;
      Object.assign(this.instance.state, this.data);
      // Add route information for page.
      history.location.__updatePageOption(options);
      history.location.__updatePageId(this.instance.instanceId);
      this.data = this.instance.state;

      if (this.instance.__ready) return;
      this.instance.__ready = true;
      this.instance._mountComponent();
    },
    unmount() {
      this.instance._unmountComponent();
    },
    show() {
      if (this.instance && this.instance.__mounted) {
        // Update current location pageId
        const history = getMiniAppHistory();
        history.location.__updatePageId(this.instance.instanceId);
        this.instance._trigger(ON_SHOW);
      }
    },
    hide() {
      if (this.instance.__mounted) this.instance._trigger(ON_HIDE);
    }
  });
  return config;
}

function getComponentCycles(Klass) {
  return getNativeComponentLifecycle({
    mount: function() {
      const { instanceId, props } = generateBaseOptions(this, Klass.defaultProps, Klass.__highestLevelProps);
      this.instance = new Klass(props);
      this.instance.__highestLevelProps = Klass.__highestLevelProps;
      this.instance.instanceId = instanceId;
      this.instance.type = Klass;
      this.instance._internal = this;
      Object.assign(this.instance.state, this.data);
      setComponentInstance(this.instance);

      if (GET_DERIVED_STATE_FROM_PROPS in Klass) {
        this.instance['__' + GET_DERIVED_STATE_FROM_PROPS] = Klass[GET_DERIVED_STATE_FROM_PROPS];
      }

      this.data = this.instance.state;
      this.instance._mountComponent();
    },
    unmount: function() {
      this.instance._unmountComponent();
    }
  });
}

function createProxyMethods(events) {
  const methods = {};
  if (Array.isArray(events)) {
    events.forEach(eventName => {
      methods[eventName] = function(...args) {
        attachEvent.apply(this, [eventName].concat(args));
      };
    });
  }
  return methods;
}

function createAnonymousClass(render) {
  const Klass = class extends Component {
    render(props) {
      return render.call(this, props);
    }
  };
  // Transfer __highestLevelProps
  Klass.__highestLevelProps = render.__highestLevelProps;
  return Klass;
}

/**
 * Bridge from Rax component class to MiniApp Component constructor.
 * @param {Class|Function} component Rax component definition.
 * @param {Object} options.
 * @return {Object} MiniApp constructor's config.
 */
function createConfig(component, options) {
  const Klass = isClassComponent(component)
    ? component
    : createAnonymousClass(component);

  const { events, isPage } = options;
  const cycles = isPage ? getPageCycles(Klass) : getComponentCycles(Klass);

  const config = {
    data: {},
    ...cycles,
    ...getComponentBaseConfig()
  };

  const proxiedMethods = createProxyMethods(events);
  if (isPage || isQuickapp) {
    Object.assign(config, proxiedMethods);
    // Bind config to instance
    Klass.__proto__.__config = config;
    registerEventsInConfig(Klass, component.__nativeEvents);
  } else {
    config.methods = proxiedMethods;
  }

  return config;
}

/**
 * Bridge App definition.
 * @param appConfig
 * @param pageProps
 */
export function runApp(appConfig, pageProps = {}) {
  if (_appConfig) {
    throw new Error('runApp can only be called once.');
  }
  const globalRoutes = __updateRouterMap(appConfig);

  _appConfig = appConfig; // Store raw app config to parse router.

  _pageProps = pageProps; // Store global page props to inject to every page props

  var _onCreate = appConfig.onCreate;
  var appOptions = Object.assign({}, appConfig, {
    // Bridge app launch.
    onCreate: function onCreate(launchOptions) {
      var launchQueue = appCycles.create;
      _onCreate && _onCreate();
      if (Array.isArray(launchQueue) && launchQueue.length > 0) {
        var fn;

        while (fn = launchQueue.pop()) {
          // eslint-disable-line
          fn.call(this, launchOptions);
        }
      }
    },
    onLaunch(launchOptions) {
      executeCallback(this, ON_LAUNCH, launchOptions);
    },
    onShow(showOptions) {
      executeCallback(this, ON_SHOW, showOptions);
    },
    onHide() {
      executeCallback(this, ON_HIDE);
    },
    onError(error) {
      executeCallback(this, ON_ERROR, error);
    },
    onShareAppMessage(shareOptions) {
      // There will be one callback fn for shareAppMessage at most
      const callbackQueue = appCycles[ON_SHARE_APP_MESSAGE];
      if (Array.isArray(callbackQueue) && callbackQueue[0]) {
        return callbackQueue[0].call(this, shareOptions);
      }
    },
    globalRoutes
  }); // eslint-disable-next-line

  return appOptions;
}

export function createPage(definition, options = {}) {
  options.isPage = true;
  return createConfig(definition, options);
}

export function createComponent(definition, options = {}) {
  return createConfig(definition, options);
}

function isClassComponent(Klass) {
  return Klass.prototype.__proto__ === Component.prototype;
}

function generateBaseOptions(internal, defaultProps, ...restProps) {
  const tagId = getId('tag', internal);
  const parentId = getId('parent', internal);
  let instanceId = '';
  if (isQuickapp) {
    instanceId = `${parentId}-${tagId}`;
  } else {
    instanceId = tagId;
  }

  const props = Object.assign({}, defaultProps, internal[PROPS], {
    TAGID: tagId,
    PARENTID: parentId
  }, getComponentProps(instanceId), ...restProps);
  return {
    instanceId,
    props
  };
}

/**
 * Execute App life cycle callback(s)
 *
 * @param {object} instance App instance
 * @param {string} cycle
 * @param {*} [param={}]
 */
function executeCallback(instance, cycle, param = {}) {
  const callbackQueue = appCycles[cycle];
  if (Array.isArray(callbackQueue) && callbackQueue.length > 0) {
    callbackQueue.forEach(fn => fn.call(instance, param));
  }
}
