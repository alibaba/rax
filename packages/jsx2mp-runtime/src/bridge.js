/* global getCurrentPages */
import Component from './component';
import { supportComponent2 } from './env';
import {
  RENDER,
  ON_SHOW,
  ON_HIDE,
  COMPONENT_DID_MOUNT,
  COMPONENT_DID_UPDATE,
  COMPONENT_WILL_MOUNT,
  COMPONENT_WILL_RECEIVE_PROPS,
  COMPONENT_WILL_UNMOUNT,
} from './cycles';

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
  return {
    onLoad(options) {
      this.instance = new Klass(this.props);
      // Reverse sync from state to data.
      this.instance._setInternal(this);
      // Add route information for page.
      this.instance.props.route = {
        path: getCurrentPageUrl(),
        query: options,
      };
      this.setData(this.instance.state);
      this.instance._trigger(COMPONENT_WILL_MOUNT);
      this.instance._trigger(RENDER);
    },
    onReady() {
      this.instance._trigger(COMPONENT_DID_MOUNT);
    },
    onUnload() {
      this.instance._trigger(COMPONENT_WILL_UNMOUNT);
    },
    onShow() {
      this.instance._trigger(ON_SHOW);
    },
    onHide() {
      this.instance._trigger(ON_HIDE);
    },
  };
}

function getComponentCycles(Klass) {
  const isSupportComponent2 = supportComponent2();
  function onInit() {
    // `this` point to page/component insatnce.
    this.instance = new Klass(this.props);
    this.instance._setInternal(this);
    this.setData(this.instance.state);
    this.instance._trigger(COMPONENT_WILL_MOUNT);
    this.instance._trigger(RENDER);
    if (!isSupportComponent2) {
      this.instance._trigger(COMPONENT_DID_MOUNT);
    }
  }

  const cycles = {
    didMount: onInit,
    didUpdate() {
      this.instance._trigger(COMPONENT_DID_UPDATE);
    },
    didUnmount() {
      this.instance._trigger(COMPONENT_WILL_UNMOUNT);
    },
  };

  if (isSupportComponent2) {
    cycles.onInit = onInit;
    cycles.didMount = function() {
      this.instance._trigger(COMPONENT_DID_MOUNT);
    };
    cycles.deriveDataFromProps = function(nextProps) {
      const nextState = this.instance.state;
      this.instance._trigger(COMPONENT_WILL_RECEIVE_PROPS, nextProps, nextState);
    };
  }
  return cycles;
}

function createProxyMethods(events) {
  const methods = {};
  if (Array.isArray(events)) {
    events.forEach(eventName => {
      methods[eventName] = function(...args) {
        // `this` point to page/component instance.
        const event = args[args.length - 1];
        let context = this.instance; // Context default to Rax component instance.

        const dataset = event.target.dataset;
        const datasetArgs = [];
        // Universal event args
        const datasetKeys = Object.keys(dataset);
        if (datasetKeys.length > 0) {
          datasetKeys.forEach((key) => {
            if ('argContext' === key) {
              context = dataset[key] === 'this' ? this.instance : dataset[key];
            } else if (isDatasetArg(key)) {
              // eg. arg0, arg1
              datasetArgs[key.slice(3)] = dataset[key];
            }
          });
        } else {
          Object.keys(this.props).forEach(key => {
            if ('data-arg-context' === key) {
              context = this.props[key] === 'this' ? this.instance : this.props[key];
            } else if (isDatasetKebabArg(key)) {
              // `data-arg-` length is 9.
              datasetArgs[key.slice(9)] = this.props[key];
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

/**
 * Bridge from Rax component class to MiniApp Component constructor.
 * @param {Class|Function} component Rax component definition.
 * @param {Object} options.
 * @return {Object} MiniApp constructor's config.
 */
function createConfig(component, options) {
  let Klass;
  if (!isClassComponent(component)) {
    Klass = class extends Component {
      render(props) {
        return component(props);
      }
    };
  } else {
    Klass = component;
  }

  const { events, isPage } = options;
  const cycles = isPage ? getPageCycles(Klass) : getComponentCycles(Klass);
  const config = {
    data() {},
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

/**
 * Bridge App definition.
 * @param Klass
 * @return instance
 */
export function createApp(Klass) {
  return new Klass();
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

const DATASET_ARG_REG = /arg\d+/;
function isDatasetArg(str) {
  return DATASET_ARG_REG.test(str);
}

function addLeadingSlash(str) {
  return str[0] === '/' ? str : '/' + str;
}

function getCurrentPageUrl() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  return addLeadingSlash(currentPage.route);
}
