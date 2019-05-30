import Host from './host';
import Component from './component';

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
function triggerCicyleEvent(instance, cicyleName, args = {}) {
  instance[cicyleName] &&
    typeof instance[cicyleName] === 'function' &&
    instance[cicyleName].call(instance, ...args);
}
function bindEvents(args) {
  const { componentConfig, handleEventsList, isComponent } = args;
  handleEventsList.forEach(eventName => {
    processEvent(eventName, componentConfig, isComponent);
  });
}
function processEvent(eventHandlerName, obj, isComponent) {
  const currentMethod = isComponent ? obj.methods : obj;
  currentMethod[eventHandlerName] = function(event) {
    const scope = this.instance;
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
 * @param {Object} options miniApp page options.
 * @param {Class|Function} ComponentClass current componentClass.
 * @param {Boolean} isClass is a Class or a Function.
 *
 */
function initInstance(options = {}, ComponentClass, isClass) {
  if (isClass) {
    this.instance = new ComponentClass({});
  } else {
    this.instance = ComponentClass;
  }
  this.instance.scopeInit(this);
  this.instance._isReady = true;
}
/**
 * synchronize methods in the rax component to the miniApp component config
 * @param {Object} componentConfig miniApp config.
 * @param {Object or Function} ComponentClass current componentClass.
 * @param {Boolean} isClass is a Class or a Function.
 * @param {Class} baseComponent function Component is necessary.
 * @return {Array} an array containing custom events
 */
function initMethods(args) {
  const {
    componentConfig,
    ComponentClass,
    isClass,
    baseComponent,
    events
  } = args;
  const componentClass = ComponentClass;
  const handleEventsList = [];
  let currentClass = {};
  let classProto = {};
  let classMethods = [];
  if (isClass) {
    classMethods = Object.getOwnPropertyNames(componentClass.prototype);
    currentClass = componentClass;
    classProto = componentClass.prototype;
  } else {
    classMethods = events || [];
    currentClass = baseComponent;
    classProto = componentClass();
  }
  classMethods.forEach(methodName => {
    if ('constructor' === methodName || PAGE_CICYLES.indexOf(methodName) > -1)
      return;
    if (PAGE_EVENTS_HANDLE_LIST.indexOf(methodName) > -1) {
      componentConfig[methodName] = classProto[methodName];
    } else if (EVENTS_LIST.indexOf(methodName) > -1) {
      componentConfig.events[methodName] = classProto[methodName];
    } else {
      currentClass[methodName] = classProto[methodName];
      handleEventsList.push(methodName);
    }
  });
  return handleEventsList;
}
/**
 * convert rax lifecycle to miniApp configuration
 * @param {Object | Function} ComponentClass current componentClass.
 * @param {Boolean} isClass is a Class or a Function.
 * @return {Object} miniApp config
 */
function transformCicyle(ComponentClass, isClass) {
  return {
    onLoad(options = {}) {
      if (isClass) {
        this.instance = ComponentClass;
      }
      initInstance.apply(this, [options, ComponentClass, isClass]);
      triggerCicyleEvent(this.instance, 'componentWillMount');
    },
    onReady() {
      triggerCicyleEvent(this.instance, 'componentDidMount');
    },
    onUnload() {
      triggerCicyleEvent(this.instance, 'componentWillUnmount');
    },
    onShow() {
      triggerCicyleEvent(this.instance, 'componentDidShow');
    },
    onHide() {
      triggerCicyleEvent(this.instance, 'componentDidHide');
    }
  };
}
/**
 *
 * @param {Object | Function} ComponentClass
 * @param {Boolean} isClass
 */
function transformComponentCicyle(ComponentClass, isClass) {
  let _componentConfig = {};
  if (my !== undefined && my.canIUse('component2')) {
    _componentConfig = {
      onInit() {
        if (isClass) {
          this.instance = ComponentClass;
        }
        initInstance.apply(this, [{}, ComponentClass, isClass]);
        this.instance.functionClass(this.props);
        triggerCicyleEvent(this.instance, 'componentWillMount');
      },
      deriveDataFromProps(nextProps) {
        const nextState = this.instance.state;
        triggerCicyleEvent(this.instance, 'componentWillReceiveProps', {
          nextState,
          nextProps
        });
      },
      didMount() {
        triggerCicyleEvent(this.instance, 'componentDidMount');
      }
    };
  } else {
    _componentConfig = {
      didMount() {
        if (isClass) {
          this.instance = ComponentClass;
        }
        initInstance.apply(this, [{}, ComponentClass, isClass]);
        this.instance.functionClass(this.props);
        triggerCicyleEvent(this.instance, 'componentDidMount');
      }
    };
  }
  return Object.assign({}, _componentConfig, {
    didUpdate(prevProps, prevData) {
      triggerCicyleEvent(this.instance, 'componentDidUpdate', {
        prevProps,
        prevData
      });
    },
    didUnmount() {
      triggerCicyleEvent(this.instance, 'componentWillUnmount');
    }
  });
}

/**
 * Bridge App definition.
 * @param Klass
 * @return instance
 */
export function createApp(Klass) {
  return new Klass();
}

/**
 * Bridge from Rax page component class to MiniApp Component constructor.
 * @param {RaxComponent} ComponentClass Rax page component.
 * @return {Object} MiniApp Page constructor's config.
 */
export function createPage(ComponentClass) {
  const isClass = ComponentClass.prototype.__proto__ === Component.prototype;
  let handleEventsList = [];
  let componentConfig = {};
  if (isClass) {
    const componentInstance = new ComponentClass({});
    const { prototype: componentPrototype, defaultProps } = ComponentClass;
    const { props, state } = componentInstance;
    const initData = Object.assign({}, defaultProps, props, state);
    handleEventsList = initMethods({
      componentConfig,
      ComponentClass,
      isClass
    });
    componentConfig = Object.assign(
      {
        data: initData,
        state: state,
        props: Object.assign({}, props, defaultProps),
        events: {}
      },
      transformCicyle(ComponentClass, isClass)
    );
  } else {
    const baseComponent = new Component();
    const componentClass = ComponentClass;
    Host.current = baseComponent;
    componentConfig = {
      events: {},
      data: baseComponent._state
    };
    handleEventsList = initMethods({
      componentConfig,
      ComponentClass,
      isClass,
      baseComponent
    });
    const instance = Object.assign(...componentClass(), baseComponent);
    Object.assign(componentConfig, transformCicyle(instance, isClass));
  }
  bindEvents({
    componentConfig,
    handleEventsList
  });
  return componentConfig;
}

export function createComponent(ComponentClass, options = {}) {
  const isClass = ComponentClass.prototype.__proto__ === Component.prototype;
  const { events } = options;
  let handleEventsList = [];
  let componentConfig = {};
  if (isClass) {
    const componentInstance = new ComponentClass({});
    const { prototype: componentPrototype, defaultProps } = ComponentClass;
    const { props, state, mixins } = componentInstance;
    const initData = Object.assign({}, defaultProps, props, state);
    handleEventsList = initMethods({
      componentConfig,
      ComponentClass,
      isClass
    });
    componentConfig = Object.assign(
      {
        data: initData,
        state: state,
        props: Object.assign({}, props, defaultProps),
        methods: {},
        mixins: mixins || []
      },
      componentConfig,
      transformComponentCicyle(ComponentClass, isClass)
    );
  } else {
    const componentClass = ComponentClass;
    const baseComponent = new Component({
      functionClass: componentClass
    });
    Host.current = baseComponent;
    handleEventsList = initMethods({
      componentConfig,
      ComponentClass,
      isClass,
      baseComponent,
      events
    });
    componentConfig = Object.assign(
      {
        methods: {}
      },
      componentConfig,
      transformComponentCicyle(baseComponent, isClass)
    );
  }
  bindEvents({
    componentConfig,
    handleEventsList,
    isComponent: true
  });
  return componentConfig;
}
