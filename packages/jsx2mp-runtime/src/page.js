import { MiniComponent } from './baseComponent';
import Host from './host';
import { Current } from './current-owner';

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
  const { componentConfig, handleEventsList } = args;
  handleEventsList.forEach(eventName => {
    processEvent(eventName, componentConfig);
  });
}
function processEvent(eventHandlerName, obj) {
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
/**
 * bind scope from componentClass to miniApp and init global instance.
 * @param options {options} miniApp page options.
 * @param ComponentClass {ComponentClass} current componentClass.
 * @param isClass {isClass} is a Class or a Function.
 *
 */
function initInstance(options = {}, ComponentClass, isClass) {
  if (isClass) {
    this.miniInstance = new ComponentClass({});
  } else {
    this.miniInstance = ComponentClass;
  }
  this.miniInstance.scopeInit(this);
  this.miniInstance.miniRoute = {
    params: options,
    // eslint-disable-next-line no-undef
    path: getCurrentPageUrl()
  };
  this.miniInstance._isReady = true;
}
/**
 * synchronize methods in the rax component to the miniApp
 * @param componentConfig {componentConfig} miniApp config.
 * @param ComponentClass {ComponentClass} current componentClass.
 * @param isClass {isClass} is a Class or a Function.
 * @param baseComponent {baseComponent} function Component is necessary.
 */
function initMethods(componentConfig, componentClass, isClass, baseComponent) {
  let classMethods = [];
  let currentClass = {};
  const handleEventsList = [];
  if (isClass) {
    classMethods = Object.getOwnPropertyNames(componentClass.prototype);
    currentClass = componentClass;
  } else {
    classMethods = Object.keys(componentClass());
    currentClass = baseComponent;
  }
  classMethods.forEach(methodName => {
    if ('constructor' === methodName || PAGE_CICYLES.indexOf(methodName) > -1)
      return;
    const fn = isClass
      ? componentClass.prototype[methodName]
      : componentClass()[methodName];
    if (PAGE_EVENTS.indexOf(methodName) > -1) {
      componentConfig[methodName] = fn;
    } else if (SPECIAL_PAGE_EVENTS.indexOf(methodName) > -1) {
      componentConfig.events[methodName] = fn;
    } else {
      isClass
        ? componentClass[methodName] = fn
        : baseComponent[methodName] = fn;
      handleEventsList.push(methodName);
    }
  });
  return handleEventsList;
}
/**
 * Bridge from Rax page component class to MiniApp Component constructor.
 * @param ComponentClass {RaxComponent} Rax page component.
 * @return {Object} MiniApp Page constructor's config.
 */
export function createPage(ComponentClass) {
  const isClass = ComponentClass.prototype.isClassComponent;
  let handleEventsList = [];
  if (isClass) {
    const componentInstance = new ComponentClass({});
    const { prototype: componentPrototype, defaultProps } = ComponentClass;
    const { props, state } = componentInstance;
    const classMethods = Object.getOwnPropertyNames(componentPrototype);
    const initData = Object.assign({}, defaultProps, props, state);
    const componentConfig = {
      data: initData,
      state: state,
      props: Object.assign({}, props, defaultProps),
      events: {}
    };
    handleEventsList = initMethods(componentConfig, ComponentClass, isClass);
    Object.assign(componentConfig, {
      onLoad(options = {}) {
        initInstance.apply(this, [options, ComponentClass, isClass]);
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
    bindEvents({
      componentConfig,
      handleEventsList
    });
    return componentConfig;
  } else {
    const baseComponent = new MiniComponent();
    const componentClass = ComponentClass;
    Host.current = baseComponent;
    const componentConfig = {
      events: {},
      data: baseComponent._state
    };
    const classMethods = Object.keys(componentClass());
    handleEventsList = initMethods(
      componentConfig,
      ComponentClass,
      isClass,
      baseComponent
    );
    Object.assign(componentConfig, {
      onLoad(options = {}) {
        this.miniInstance = Object.assign(...componentClass(), baseComponent);
        initInstance.apply(this, [options, this.miniInstance, isClass]);
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
    bindEvents({
      componentConfig,
      handleEventsList
    });
    return componentConfig;
  }
}
