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
  currentMethod[eventHandlerName] = function(event) {
    const scope = this.instance;
    const args = [];
    // TODO: Analysis args from event function, need compile support
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
  console.log(isPage, cicyles);
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
export function createPage(ComponentClass, options = {}) {
  return createConfig(ComponentClass, options, true);
}

export function createComponent(ComponentClass, options = {}) {
  return createConfig(ComponentClass, options, false);
}
