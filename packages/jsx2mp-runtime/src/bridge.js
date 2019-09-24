/* global PROPS */
import { cycles as appCycles } from './app';
import Component from './component';
import { ON_SHOW, ON_HIDE, ON_PAGE_SCROLL, ON_SHARE_APP_MESSAGE, ON_REACH_BOTTOM, ON_PULL_DOWN_REFRESH } from './cycles';
import { setComponentInstance, getComponentProps, executeCallbacks } from './updater';
import { getComponentLifecycle } from '@@ADAPTER@@';
import { createMiniAppHistory } from './history';
import { __updateRouterMap } from './router';

const GET_DERIVED_STATE_FROM_PROPS = 'getDerivedStateFromProps';
const history = createMiniAppHistory();
let _appConfig;

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
      this.instance = new Klass(this[PROPS]);
      // Reverse sync from state to data.
      this.instance._setInternal(this);
      // Add route information for page.
      history.location.__updatePageOption(options);
      Object.assign(this.instance.props, {
        history,
        location: history.location
      });
      this.data = this.instance.state;

      if (this.instance.__ready) return;
      this.instance.__ready = true;
      this.instance._mountComponent();
    },
    onReady() {}, // noop
    onUnload() {
      this.instance._unmountComponent();
    },
    onShow() {
      if (this.instance.__mounted) this.instance._trigger(ON_SHOW);
    },
    onHide() {
      if (this.instance.__mounted) this.instance._trigger(ON_HIDE);
    }
  };
  [ON_PAGE_SCROLL, ON_SHARE_APP_MESSAGE, ON_REACH_BOTTOM, ON_PULL_DOWN_REFRESH].forEach((hook) => {
    config[hook] = function(e) {
      return this.instance._trigger(hook, e);
    };
  });
  return config;
}

function getComponentCycles(Klass) {
  return getComponentLifecycle({
    mount: function() {
      const props = Object.assign({}, this[PROPS], getComponentProps(this[PROPS].__tagId));
      this.instance = new Klass(props);
      this.instance.type = Klass;

      if (this[PROPS].hasOwnProperty('__tagId')) {
        const componentId = this[PROPS].__tagId;
        setComponentInstance(componentId, this.instance);
        executeCallbacks();
      }

      if (GET_DERIVED_STATE_FROM_PROPS in Klass) {
        this.instance['__' + GET_DERIVED_STATE_FROM_PROPS] = Klass[GET_DERIVED_STATE_FROM_PROPS];
      }

      this.instance._setInternal(this);
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
        const event = args[args.length - 1];
        let context = this.instance; // Context default to Rax component instance.

        const dataset = event && event.target ? event.target.dataset : {};
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
          Object.keys(this[PROPS]).forEach(key => {
            if ('data-arg-context' === key) {
              context = this[PROPS][key] === 'this' ? this.instance : this[PROPS][key];
            } else if (isDatasetKebabArg(key)) {
              // `data-arg-` length is 9.
              datasetArgs[key.slice(9)] = this[PROPS][key];
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
  return class extends Component {
    render(props) {
      return render.call(this, props);
    }
  };
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
    props: {},
    ...cycles,
  };

  const proxiedMethods = createProxyMethods(events);
  if (isPage) {
    Object.assign(config, proxiedMethods);
  } else {
    config.methods = proxiedMethods;
  }

  return config;
}

function noop() {}


/**
 * Bridge App definition.
 * @param appConfig
 */
export function runApp(appConfig) {
  if (_appConfig) {
    throw new Error('runApp can only be called once.');
  }

  _appConfig = appConfig; // Store raw app config to parse router.

  __updateRouterMap(appConfig);

  const appOptions = {
    // Bridge app launch.
    onLaunch(launchOptions) {
      const launchQueue = appCycles.launch;
      if (Array.isArray(launchQueue) && launchQueue.length > 0) {
        let fn;
        while (fn = launchQueue.pop()) { // eslint-disable-line
          fn.call(this, launchOptions);
        }
      }
    },
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

const DATASET_KEBAB_ARG_REG = /data-arg-\d+/;

function isDatasetKebabArg(str) {
  return DATASET_KEBAB_ARG_REG.test(str);
}

const DATASET_ARG_REG = /arg-?(\d+)/;

function isDatasetArg(str) {
  return DATASET_ARG_REG.test(str);
}
