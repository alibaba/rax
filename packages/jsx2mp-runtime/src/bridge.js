/* global PROPS, TAGID */
// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp } from 'universal-env';
import { cycles as appCycles } from './app';
import Component from './component';
import { ON_SHOW, ON_HIDE, ON_SHARE_APP_MESSAGE, ON_LAUNCH, ON_ERROR } from './cycles';
import { setComponentInstance, getComponentProps } from './updater';
import {
  getNativePageLifecycle,
  getNativeComponentLifecycle,
  getComponentBaseConfig,
  getEventProps,
} from './adapter/index';
import { createMiniAppHistory, getMiniAppHistory } from './history';
import { __updateRouterMap } from './router';
import getId from './getId';
import { setPageInstance } from './pageInstanceMap';
import { registerEventsInConfig } from './nativeEventListener';
import { isPlainObject, isEmptyObj } from './types';

const { TYPE, TARGET, TIMESTAMP } = getEventProps();

const GET_DERIVED_STATE_FROM_PROPS = 'getDerivedStateFromProps';
let _appConfig;
let _pageProps = {};

/**
 * Record events
 * timestamp -> { detail, type }
 */
const eventsMap = {};

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
      this.instance.__pageOptions = options;
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
        history.location.__updatePageOption(this.instance.__pageOptions);
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
      const { instanceId, props } = generateBaseOptions(this, Klass.defaultProps);
      // Inject history
      if (Klass.__injectHistory) {
        const history = getMiniAppHistory();
        Object.assign(props, {
          history,
          location: history.location
        });
      }
      this.instance = new Klass(props, this);
      this.instance.__injectHistory = Klass.__injectHistory;
      this.instance.instanceId = instanceId;
      this.instance.type = Klass;
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
        let event = args.find(arg => isPlainObject(arg) && arg[TYPE] && arg[TIMESTAMP] && isPlainObject(arg[TARGET]));

        // Context default to Rax component instance.
        const contextInfo = {
          context: this.instance
        };

        // proxyed event arguments
        let proxyedArgs = [];

        if (event) {
          if (isQuickApp) {
            // shallow copy event & event._target
            event = {...event};
            event._target = {...event._target};
            // align the currentTarget variable for quickapp
            event.currentTarget = event._target;
            event.currentTarget.dataset = event._target._dataset;
          } else {
            // set stopPropagation method
            event.stopPropagation = () => {
              eventsMap[toleranceEventTimeStamp(event.timeStamp)] = {
                detail: event.detail,
                type: event.type
              };
            };

            const prevEvent = eventsMap[toleranceEventTimeStamp(event.timeStamp)];
            // If prevEvent exists, and event type & event detail are the same, stop event triggle
            if (prevEvent && prevEvent.type === event.type) {
              let isSame = true;
              for (let key in prevEvent.detail) {
                if (prevEvent.detail[key] !== event.detail[key]) {
                  isSame = false;
                  break;
                }
              }
              if (isSame) {
                return;
              }
            }
          }

          const dataset = event && event.currentTarget ? event.currentTarget.dataset : {};

          // Universal event args
          const datasetKeys = Object.keys(dataset);
          const formatedEventName = formatEventName(eventName);
          datasetKeys.forEach((key, idx) => {
            if (`${formatedEventName}ArgContext` === key || `${formatedEventName}-arg-context` === key) {
              contextInfo.context = dataset[key] === 'this' ? this.instance : dataset[key];
              contextInfo.changed = true;
            } else if (isDatasetArg(key)) {
            // eg. arg0, arg1, arg-0, arg-1
              const index = Number(DATASET_ARG_REG.exec(key)[1]);
              proxyedArgs[index] = dataset[key];

              if (!contextInfo.changed && idx !== index) {
              // event does not exist on dataset
                proxyedArgs[idx] = event;
              }
            }
          });

          /**
           * event should be last param
           * when onClick={handleClick.bind(this, 1)}
           * or onClick={handleClick}
           */
          if (contextInfo.changed || !proxyedArgs.length) {
            proxyedArgs.push(event);
          }
        } else {
          proxyedArgs = args;
        }

        if (this.instance._methods[eventName]) {
          return this.instance._methods[eventName].apply(contextInfo.context, proxyedArgs);
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
    constructor(props, _internal) {
      super(props, _internal, true);
      this.__compares = render.__compares;
      // Handle functional component shouldUpdateComponent
      if (!this.shouldComponentUpdate && this.__compares) {
        const compares = this.__compares;
        this.shouldComponentUpdate = nextProps => {
          // Process composed compare
          let arePropsEqual = true;

          // Compare push in and pop out
          for (let i = compares.length - 1; i > -1; i--) {
            if (arePropsEqual = compares[i](this.props, nextProps)) {
              break;
            }
          }

          return !arePropsEqual;
        };
      }
    }
    render(props) {
      return render.call(this, props);
    }
  };
  // Transfer __injectHistory
  Klass.__injectHistory = render.__injectHistory;
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
    if (isQuickApp) {
      // quickapp's component and page share the same structure
      Object.assign(config, proxiedMethods);
    } else {
      config.methods = proxiedMethods;
    }
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

  if (isQuickApp) {
    // Quickapp's app returns config as JSON
    return Object.assign(appOptions, {
      onCreate: function(launchOptions) {
        // excute quickapp's create cycle
        const _onCreate = appConfig.onCreate;
        _onCreate && _onCreate();
        const launchQueue = appCycles.create;
        if (Array.isArray(launchQueue) && launchQueue.length > 0) {
          let fn;
          while (fn = launchQueue.pop()) {
            // eslint-disable-line
            fn.call(this, launchOptions);
          }
        }
      },
      globalRoutes: __updateRouterMap(appConfig), // store globalRoutes in case overrided when page reinited
      login: appConfig.login, // store global login object for common login page
    });
  } else {
    // eslint-disable-next-line
    App(appOptions);
  }
}

export function createPage(definition, options = {}) {
  options.isPage = true;
  return createConfig(definition, options);
}

export function createComponent(definition, options = {}) {
  return createConfig(definition, options);
}

function isClassComponent(Klass) {
  return Klass.prototype instanceof Component;
}

const DATASET_ARG_REG = /\w+-?[aA]rg?-?(\d+)/;

function isDatasetArg(str) {
  return DATASET_ARG_REG.test(str);
}

function formatEventName(name) {
  return name.replace('_', '');
}

// throttle 50ms
function toleranceEventTimeStamp(timeStamp) {
  return Math.floor(timeStamp / 10) - 5;
}

function generateBaseOptions(internal, defaultProps, ...restProps) {
  const instanceId = getId('tag', internal);

  const props = Object.assign({}, defaultProps, internal[PROPS], {
    TAGID: instanceId,
    // In MiniApp every slot is scopedSlots
    $slots: {
      ...internal[PROPS].$slots,
      ...internal[PROPS].$scopedSlots
    }
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
