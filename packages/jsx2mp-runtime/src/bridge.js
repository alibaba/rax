/* global PROPS */
import { cycles as appCycles } from './app';
import Component from './component';
import { ON_SHOW, ON_HIDE, ON_SHARE_APP_MESSAGE, ON_LAUNCH, ON_ERROR } from './cycles';
import { setComponentInstance, getComponentProps } from './updater';
import getNativeComponentLifecycle from './adapter/getNativeComponentLifecycle';
import getComponentBaseConfig from './adapter/getComponentBaseConfig';
import {createMiniAppHistory, getMiniAppHistory} from './history';
import { __updateRouterMap } from './router';
import getId from './getId';
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
  let config = {
    onLoad(options) {
      // Ensure page has loaded
      const history = createMiniAppHistory();
      const { instanceId, props } = generateBaseOptions(this, Klass.defaultProps, {
        history,
        location: history.location
      }, _pageProps);
      this.instance = new Klass(props);
      this.instance.defaultProps = Klass.defaultProps;
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
    onUnload() {
      this.instance._unmountComponent();
    },
    onShow() {
      if (this.instance && this.instance.__mounted) {
        // Update current location pageId
        const history = getMiniAppHistory();
        history.location.__updatePageId(this.instance.instanceId);
        this.instance._trigger(ON_SHOW);
      }
    }
  };
  return config;
}

function getComponentCycles(Klass) {
  return getNativeComponentLifecycle({
    mount: function() {
      const { instanceId, props } = generateBaseOptions(this, Klass.defaultProps, Klass.__highestLevelProps);
      this.instance = new Klass(props);
      this.instance.defaultProps = Klass.defaultProps || {};
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
        // `this` point to page/component instance.
        const event = args[0];
        let context = this.instance; // Context default to Rax component instance.

        const dataset = event && event.currentTarget ? event.currentTarget.dataset : {};
        const datasetArgs = [];
        // Universal event args
        const datasetKeys = Object.keys(dataset);
        if (datasetKeys.length > 0) {
          datasetKeys.forEach((key) => {
            if ('argContext' === key || 'arg-context' === key) {
              context = dataset[key] === 'this' ? this.instance : dataset[key];
            } else if (isDatasetArg(key)) {
              // eg. arg0, arg1, arg-0, arg-1
              const index = DATASET_ARG_REG.exec(key)[1];
              datasetArgs[index] = dataset[key];
            }
          });
        } else {
          const formatName = formatEventName(eventName);
          Object.keys(this[PROPS]).forEach(key => {
            if (`data-${formatName}-arg-context` === key) {
              context = this[PROPS][key] === 'this' ? this.instance : this[PROPS][key];
            } else if (isDatasetKebabArg(key)) {
              // `data-arg-` length is 9.
              const len = `data-${formatName}-arg-`.length;
              datasetArgs[key.slice(len)] = this[PROPS][key];
            }
          });
        }
        // Concat args.
        args = datasetArgs.concat(args);
        if (this.instance._methods[eventName]) {
          return this.instance._methods[eventName].apply(context, args);
        } else {
          console.warn(`instance._methods['${eventName}'] not exists.`);
        }
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
  // Set functional component properties to the Klass
  Object.keys(render).forEach(key => {
    Klass[key] = render[key];
  });
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
  if (isPage) {
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

  _appConfig = appConfig; // Store raw app config to parse router.
  _pageProps = pageProps; // Store global page props to inject to every page props
  __updateRouterMap(appConfig);

  const appOptions = {
    // Bridge app launch.
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
    }
  };

  // eslint-disable-next-line
  App(appOptions);
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

const DATASET_KEBAB_ARG_REG = /data-\w+\d+-arg-\d+/;

function isDatasetKebabArg(str) {
  return DATASET_KEBAB_ARG_REG.test(str);
}

const DATASET_ARG_REG = /\w+-?[aA]rg?-?(\d+)/;

function isDatasetArg(str) {
  return DATASET_ARG_REG.test(str);
}

function formatEventName(name) {
  return name.replace('_', '');
}

function generateBaseOptions(internal, defaultProps, ...restProps) {
  const tagId = getId('tag', internal);
  const parentId = getId('parent', internal);
  const instanceId = tagId;

  const props = Object.assign({}, defaultProps, internal[PROPS], {
    __tagId: tagId,
    __parentId: parentId
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
