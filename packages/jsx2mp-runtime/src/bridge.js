import Host from './host';
import Component from './component';
import {
  willMount,
  didMount,
  didUpdate,
  didUnmount,
  deriveDataFromProps,
  onShow,
  onHide,
  onUnload
} from './cicyles';

const PAGE_EVENTS_HANDLE_LIST = [
  'onShareAppMessage',
  'onTitleClick',
  'onOptionMenuClick',
  'onPopMenuClick',
  'onPullDownRefresh',
  'onTabItemTap',
  'onPageScroll',
  'onReachBottom',
  'beforeTabItemTap',
  'onResize'
];
const EVENTS_LIST = ['onBack', 'onKeyboardHeight', 'onPullIntercept'];
const PAGE_CICYLES = [
  'componentDidMount',
  'componentDidUpdate',
  'componentWillMount',
  'componentWillReceiveProps',
  'componentWillUnmount',
  'componentWillUpdate',
  'shouldComponentUpdate'
];
function bindEvents(args) {
  const { componentConfig, handleEventsList, isPage } = args;
  handleEventsList.forEach(eventName => {
    processEvent(eventName, componentConfig, isPage);
  });
}

function processEvent(eventHandlerName, obj, isPage) {
  const currentMethod = isPage ? obj : obj.methods;
  currentMethod[eventHandlerName] = function(...args) {
    const event = args[args.length - 1];
    let scope = this.instance;

    const dataset = event.target ? event.target.dataset : {};
    const argsName = Object.keys(dataset);
    // is universal event args
    if (argsName && argsName.length > 0) {
      const argsValue = Object.values(dataset);
      args = args.concat(argsValue);
    } else {
      // is props event args
      const props = this.instance.props;
      const _args = [];
      Object.keys(props).forEach((key) => {
        if ('data-arg-context' === key) {
          scope = props[key];
          if (scope === 'this') scope = this.instance;
        } else if (/data-arg-\d+/.test(key)) {
          _args[key.slice(9)] = props[key];
        }
      })
      args = _args.concat(args);
    }

    return (
      scope[eventHandlerName] && scope[eventHandlerName].apply(scope, args)
    );
  };
}
function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}

function getCurrentPageUrl() {
  // eslint-disable-next-line no-undef
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  return addLeadingSlash(currentPage.route || currentPage.__route__);
}
/**
 * bind scope from componentClass to miniApp and init global instance.
 * @param {Object} options miniApp page options.
 * @param {Class|Function} ComponentClass current componentClass.
 * @param {Boolean} isClass is a Class or a Function.
 *
 */
function initInstance(options = {}, ComponentClass, isPage) {
  this.instance = new ComponentClass({});
  if (isPage) {
    this.instance.props.route = {
      path: getCurrentPageUrl(),
      query: options
    };
  }
  this.instance.scopeInit(this);
  this.instance._isReady = true;
}
function judgeEventType(name) {
  switch (name) {
    case PAGE_EVENTS_HANDLE_LIST.includes(name): {
      return 'PAGE_EVENT_HANDLE';
      break;
    }
    case EVENTS_LIST.includes(name): {
      return 'PAGE_EVENT';
      break;
    }
    default: {
      return 'CUSTOM_EVENT';
      break;
    }
  }
}
function setComponentMethdos(Klass, events = [], config) {
  const current = new Klass();
  const currentReturns = current.render({});
  events.forEach(eventName => {
    const eventHandler = currentReturns[eventName];
    const eventType = judgeEventType(eventName);
    if (eventHandler && typeof eventHandler === 'function') {
      switch (eventType) {
        case 'PAGE_EVENT_HANDLE': {
          config[eventName] = eventHandler;
          break;
        }
        case 'PAGE_EVENT': {
          config.events[eventName] = eventHandler;
          break;
        }
        default: {
          config.methods[eventName] = eventHandler;
          config.data[eventName] = eventHandler;
          config[eventName] = eventHandler;
          break;
        }
      }
      Klass.prototype[eventName] = eventHandler;
    }
  });
  return config;
}
/**
 * convert rax lifecycle to miniApp configuration
 * @param {Object | Function} ComponentClass current componentClass.
 * @param {Boolean} isClass is a Class or a Function.
 * @return {Object} miniApp config
 */
function getPageCicyle(Klass) {
  return {
    onLoad(options = {}) {
      this.instance = new Klass();
      initInstance.apply(this, [options, Klass, true, true]);
      this.instance.setState({
        props: this.props,
        ...this.instance.render(this.props)
      });
      willMount(this.instance);
    },
    onReady: didMount,
    onUnload,
    onShow,
    onHide
  };
}
/**
 *
 * @param {Object} ComponentClass
 */
function getComponentCicyles(Klass) {
  const canUseComponent2 = my !== undefined && my.canIUse('component2');
  const init = function() {
    this.instance = new Klass();
    initInstance.apply(this, [{}, Klass, true]);
    this.instance.setState({
      props: this.props,
      ...this.instance.render(this.props)
    });
    if (canUseComponent2) {
      willMount(this.instance);
    } else {
      didMount(this.instance);
    }
  };
  const config = {
    didUpdate,
    didUnmount
  };
  if (canUseComponent2) {
    return {
      onInit: init,
      deriveDataFromProps,
      didMount,
      ...config
    };
  } else {
    return {
      didMount: init,
      ...config
    };
  }
}
function isClassComponent(Klass) {
  return Klass.prototype.__proto__ === Component.prototype;
}

/**
 * Bridge from Rax page component class to MiniApp Component constructor.
 * @param {RaxComponent} ComponentClass Rax page component.
 * @return {Object} MiniApp Page constructor's config.
 */
function createConfig(componentClass, options = {}, isPage) {
  let Klass = componentClass;
  const { events = [] } = options;
  if (!isClassComponent(Klass)) {
    Klass = class extends Component {
      render(props = {}) {
        return componentClass(props);
      }
    };
  }
  const cicyles = isPage ? getPageCicyle(Klass) : getComponentCicyles(Klass);
  const config = setComponentMethdos(Klass, events, {
    data: {},
    props: {},
    methods: {},
    ...cicyles
  });
  Host.current = Klass;
  bindEvents({
    componentConfig: config,
    handleEventsList: events,
    isPage
  });
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
export function createPage(Klass, options = {}) {
  return createConfig(Klass, options, true);
}

export function createComponent(Klass, options = {}) {
  return createConfig(Klass, options, false);
}
