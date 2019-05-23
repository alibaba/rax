const PAGE_EVENTS = [
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
const SPECIAL_PAGE_EVENTS = ['onBack', 'onKeyboardHeight', 'onPullIntercept'];
const PAGE_CICYLES = [
  'componentDidMount',
  'componentDidUpdate',
  'componentWillMount',
  'componentWillReceiveProps',
  'componentWillUnmount',
  'componentWillUpdate',
  'shouldComponentUpdate'
];
function triggerCicyleEvent(instance, cicyleName, args = {}) {
  instance[cicyleName] &&
    typeof instance[cicyleName] === 'function' &&
    instance[cicyleName].call(instance, ...args);
}
function bindEvents(args) {
  const { componentConfig, handleEventsList, componentType } = args;
  const baseObj =
    componentType === 'Page' ? componentConfig : componentConfig.methods;
  handleEventsList.forEach(eventName => {
    processEvent(eventName, baseObj);
  });
}
function processEvent(eventHandlerName, obj) {
  if (obj[eventHandlerName]) return;
  obj[eventHandlerName] = function(event) {
    const scope = this.miniInstance;
    const args = [];
    // TODO: Analysis args from event function, need compile support
    return scope[eventHandlerName].apply(scope, args);
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
function initInstance(options = {}, ComponentClass, componentType) {
  this.miniInstance = new ComponentClass({}, componentType);
  this.miniInstance.scopeInit(this);
  if (componentType === 'Page') {
    this.miniInstance.miniRoute = {
      params: options,
      path: getCurrentPageUrl()
    };
  }
}
/**
 * Bridge from Rax page component class to MiniApp Component constructor.
 * @param ComponentClass {RaxComponent} Rax page component.
 * @return {Object} MiniApp Page constructor's config.
 */
export function initComponent(ComponentClass, componentType) {
  const componentInstance = new ComponentClass({}, componentType);
  const { prototype: componentPrototype, defaultProps } = ComponentClass;
  const { props, state } = componentInstance;
  const classMethods = Object.getOwnPropertyNames(componentPrototype);
  const initData = Object.assign({}, defaultProps, props, state);
  const handleEventsList = [];
  const componentConfig = {
    data: initData,
    state: state,
    props: Object.assign({}, props, defaultProps)
  };
  if (componentType === 'Page') {
    componentConfig.events = {};
    classMethods.forEach(methodName => {
      if ('constructor' === methodName || PAGE_CICYLES.indexOf(methodName) > -1)
        return;
      const fn = componentPrototype[methodName];
      if (PAGE_EVENTS.indexOf(methodName) > -1) {
        componentConfig[methodName] = fn;
      } else if (SPECIAL_PAGE_EVENTS.indexOf(methodName) > -1) {
        componentConfig.events[methodName] = fn;
      } else {
        ComponentClass[methodName] = fn;
        handleEventsList.push(methodName);
      }
    });
    Object.assign(componentConfig, {
      onLoad(options = {}) {
        initInstance.apply(this, [options, ComponentClass, componentType]);
        triggerCicyleEvent(this.miniInstance, 'componentWillMount');
      },
      onReady() {
        triggerCicyleEvent(this.miniInstance, 'componentDidMount');
      },
      onUnload() {
        triggerCicyleEvent(this.miniInstance, 'componentWillUnmount');
      },
      onShow() {
        triggerCicyleEvent(this.miniInstance, 'componentDidShow');
      },
      onHide() {
        triggerCicyleEvent(this.miniInstance, 'componentDidHide');
      }
    });
  } else {
    componentConfig.methods = {};
    classMethods.forEach(methodName => {
      if ('constructor' === methodName || PAGE_CICYLES.indexOf(methodName) > -1)
        return;
      const fn = componentPrototype[methodName];
      componentConfig.methods[methodName] = fn;
      handleEventsList.push(methodName);
    });
    /**
     * Check env is support new life, if can support, init will run when the component onInit
     * if not support, it will be didMount
     */
    if (my.canIUse('component2')) {
      Object.assign(componentConfig, {
        onInit() {
          initInstance.apply(this, [{}, ComponentClass, componentType]);
          triggerCicyleEvent(this.miniInstance, 'componentWillMount');
        },
        deriveDataFromProps(nextProps) {
          const nextState = this.miniInstance.state;
          triggerCicyleEvent(this.miniInstance, 'componentWillReceiveProps', {
            nextState,
            nextProps
          });
        },
        didMount() {
          triggerCicyleEvent(this.miniInstance, 'componentDidMount');
        }
      });
    } else {
      Object.assign(componentConfig, {
        didMount() {
          initInstance.apply(this, [{}, ComponentClass, componentType]);
          triggerCicyleEvent(this.miniInstance, 'componentDidMount');
        }
      });
    }
    Object.assign(componentConfig, {
      didUpdate(prevProps, prevData) {
        triggerCicyleEvent(this.miniInstance, 'componentDidUpdate', {
          prevProps,
          prevData
        });
      },
      didUnmount() {
        triggerCicyleEvent(this.miniInstance, 'componentWillUnmount');
      }
    });
  }
  bindEvents({
    componentConfig,
    handleEventsList,
    componentType
  });
  return componentConfig;
}
