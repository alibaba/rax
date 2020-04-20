const { createElement, render } = require('rax');
const { renderToString } = require('rax-server-renderer');
const { default: findDOMNode } = require('rax-find-dom-node');
const renderer = require('rax-test-renderer');
const { default: isValidElement } = require('rax-is-valid-element');
const { EnzymeAdapter } = require('enzyme');
const createMountWrapper = require('./createMountWrapper');
const RootFinder = require('./RootFinder');
const DriverDOM = require('driver-dom');
const { isArrayLike, mapFind, flatten, ensureKeyOrUndefined } = require('./utils');
const { CURRENT_ELEMENT, INSTANCE, INTERNAL, RENDERED_COMPONENT, RENDERED_CHILDREN, HOST_NODE } = require('./constants');

function findElement(el, predicate) {
  if (el === null || typeof el !== 'object' || !('type' in el)) {
    return undefined;
  }
  if (predicate(el)) {
    return el;
  }
  const { rendered } = el;
  if (isArrayLike(rendered)) {
    return mapFind(rendered, (x) => findElement(x, predicate), (x) => typeof x !== 'undefined');
  }
  return findElement(rendered, predicate);
}

function nodeType(instance) {
  if (instance) {
    return instance.__isReactiveComponent ? 'function' : 'class';
  }
  return 'host';
}

function getNodeFromRootFinder(isCustomComponent, tree, options) {
  if (!isCustomComponent(options.wrappingComponent)) {
    return tree.rendered;
  }
  const rootFinder = findElement(tree, (node) => node.type === RootFinder);
  if (!rootFinder) {
    throw new Error('`wrappingComponent` must render its children!');
  }
  return rootFinder.rendered;
}

function childrenFromInstance(instance, el) {
  if (instance[RENDERED_CHILDREN]) {
    return Object.values(instance[RENDERED_CHILDREN]);
  }
  if (el.props) {
    return Object.values({ '.0': el.props.children });
  }
  return [];
}

function propsWithKeysAndRef(node) {
  if (node.ref !== null || node.key !== null) {
    return {
      ...node.props,
      key: node.key,
      ref: node.ref,
    };
  }
  return node.props;
}

function getWrappingComponentMountRenderer({ toTree, getMountWrapperInstance }) {
  return {
    getNode() {
      const instance = getMountWrapperInstance();
      return instance ? toTree(instance).rendered : null;
    },
    render(el, context, callback) {
      const instance = getMountWrapperInstance();
      if (!instance) {
        throw new Error('The wrapping component may not be updated if the root is unmounted.');
      }
      return instance.setWrappingComponentProps(el.props, callback);
    },
  };
}

function nodeTypeFromType(type) {
  if (typeof type === 'string') {
    return 'host';
  }
  if (type && type.prototype && type.prototype.__isReactiveComponent) {
    return 'function';
  }
  return 'class';
}

function elementToTree(el, renderedChildren) {
  if (el === null || typeof el !== 'object' || !('type' in el)) {
    return el;
  }
  const {
    type,
    props,
    key,
    ref,
  } = el;

  const { children = renderedChildren } = props;
  let rendered = null;
  if (isArrayLike(children)) {
    rendered = flatten([...children]).map(elementToTree);
  } else if (typeof children !== 'undefined') {
    rendered = elementToTree(children);
  }

  const nodeType = nodeTypeFromType(type);

  if (nodeType === 'host' && props.dangerouslySetInnerHTML) {
    if (props.children != null) {
      const error = new Error('Can only set one of `children` or `props.dangerouslySetInnerHTML`.');
      error.name = 'Invariant Violation';
      throw error;
    }
  }

  return {
    nodeType,
    type,
    props,
    key: ensureKeyOrUndefined(key),
    ref,
    instance: null,
    [HOST_NODE]: el[HOST_NODE],
    rendered,
  };
}

function instanceToTree(instance) {
  if (!instance || typeof instance !== 'object') {
    return instance;
  }

  const el = instance[CURRENT_ELEMENT];
  if (!el) {
    return null;
  }
  if (typeof el !== 'object') {
    return el;
  }

  if (instance[HOST_NODE]) {
    return {
      nodeType: 'host',
      type: el.type,
      props: el.props,
      key: ensureKeyOrUndefined(el.key),
      ref: el.ref,
      instance: instance[INSTANCE] || instance[HOST_NODE] || null,
      rendered: childrenFromInstance(instance, el).map(instanceToTree),
    };
  }

  if (instance[RENDERED_CHILDREN]) {
    return {
      nodeType: nodeType(instance[INSTANCE]),
      type: el.type,
      props: el.props,
      key: ensureKeyOrUndefined(el.key),
      ref: el.ref,
      instance: instance[INSTANCE] || instance[HOST_NODE] || null,
      rendered: Object.values(instance[RENDERED_CHILDREN]).map(instanceToTree),
    };
  }

  if (instance[RENDERED_COMPONENT]) {
    const rendered = instanceToTree(instance[RENDERED_COMPONENT]);
    return {
      nodeType: nodeType(instance[INSTANCE]),
      type: el.type,
      props: el.props,
      key: ensureKeyOrUndefined(el.key),
      ref: el.ref,
      instance: instance[INSTANCE] || instance[HOST_NODE] || null,
      rendered: rendered,
    };
  }
  return {
    nodeType: nodeType(instance[INSTANCE]),
    type: el.type,
    props: el.props,
    key: ensureKeyOrUndefined(el.key),
    ref: el.ref,
    instance: instance[INSTANCE] || null,
    rendered: childrenFromInstance(instance, el).map(instanceToTree),
  };
}

function addNativeNodeToElement(instance) {
  const renderedComponent = instance[RENDERED_COMPONENT];
  if (renderedComponent) {
    const element = renderedComponent[CURRENT_ELEMENT];
    element[HOST_NODE] = renderedComponent[HOST_NODE];
    if (renderedComponent[RENDERED_CHILDREN]) {
      Object.values(renderedComponent[RENDERED_CHILDREN])
        .filter(child => typeof child[CURRENT_ELEMENT].type === 'string')
        .map(child => {
          addNativeNodeToElement(child);
        });
    }
  }
}

class RaxAdapter extends EnzymeAdapter {
  constructor() {
    super();
    const { lifecycles } = this.options;
    this.options = {
      ...this.options,
      enableComponentDidUpdateOnSetState: true,
      legacyContextMode: 'parent',
      lifecycles: {
        ...lifecycles,
        componentDidUpdate: {
          onSetState: true,
        },
        setState: {
          skipsComponentDidUpdateOnNullish: true,
        },
        getChildContext: {
          calledByRenderer: false,
        },
      },
    };

    this.nodeToElement = this.nodeToElement.bind(this);
  }

  createMountRenderer(options) {
    let instance = null;
    const adapter = this;
    const domNode = options.attachTo || global.document.createElement('div');
    return {
      render(el, context, callback) {
        if (instance === null) {
          const { type, props, ref } = el;
          const wrapperProps = {
            Component: type,
            wrappingComponentProps: options.wrappingComponentProps,
            props,
            context,
            ...ref && { refProp: ref },
          };
          const RaxWrapperComponent = createMountWrapper(el, { ...options, adapter });
          const wrappedEl = createElement(RaxWrapperComponent, wrapperProps);
          instance = render(wrappedEl, domNode, { driver: DriverDOM });
          if (typeof callback === 'function') {
            callback();
          }
        } else {
          instance.setChildProps(el.props, context, callback);
        }
      },
      unmount() {
        instance.unmount();
        instance = null;
      },
      getNode() {
        if (!instance) {
          return null;
        }
        return getNodeFromRootFinder(
          adapter.isCustomComponent,
          instanceToTree(instance[INTERNAL]),
          options,
        );
      },
      simulateEvent(node, eventName, ...args) {
        const event = new Event(eventName, {
          bubbles: args.bubbles || true,
          composed: args.composed || false,
          cancelable: args.cancelable || false,
        });
        Object.assign(event, args);
        node.instance[INTERNAL][HOST_NODE].dispatchEvent(event);
      },
      batchedUpdates(fn) {
        fn();
      },
      getWrappingComponentRenderer() {
        return {
          ...this,
          ...getWrappingComponentMountRenderer({
            toTree: (inst) => instanceToTree(inst[INTERNAL]),
            getMountWrapperInstance: () => instance,
          }),
        };
      }
    };
  }

  createShallowRenderer(options) {
    let isDOM = false;
    let cachedNode = null;
    let instance = null;
    const adapter = this;
    return {
      render(el, context) {
        cachedNode = el;
        if (typeof el.type === 'string') {
          isDOM = true;
        } else {
          isDOM = false;
          if (instance === null) {
            const { type, props, ref } = el;
            const wrapperProps = {
              Component: type,
              wrappingComponentProps: options.wrappingComponentProps,
              props,
              context,
              ...ref && { refProp: ref },
            };
            const RaxWrapperComponent = createMountWrapper(el, { ...options, adapter });
            const wrappedEl = createElement(RaxWrapperComponent, wrapperProps);
            const container = render(wrappedEl, null, { driver: DriverDOM });
            instance = container[INTERNAL][RENDERED_COMPONENT];
          } else {
            instance.setChildProps(el.props, context);
          }
        }
      },
      getNode() {
        if (isDOM) {
          return cachedNode;
        }
        const el = instance[CURRENT_ELEMENT];
        el.instance = instance[INSTANCE];
        const children = el.instance.__children;
        if (Array.isArray(children)) {
          throw new Error('ReactWrapper::getNode() can only be called when wrapping one node');
        }
        addNativeNodeToElement(instance);
        return elementToTree(el, [children]);
      },
      simulateEvent(node, eventName, ...args) {
        const event = new Event(eventName, {
          bubbles: args.bubbles || true,
          composed: args.composed || false,
          cancelable: args.cancelable || false,
        });
        Object.assign(event, args);
        node[HOST_NODE].dispatchEvent(event);
      },
      unmount() {
        instance.unmount();
        instance = null;
      },
      batchedUpdates(fn) {
        fn();
      },
    };
  }

  createStringRenderer(options) {
    return {
      render(...args) {
        return renderToString(...args);
      },
    };
  }

  // Provided a bag of options, return an `EnzymeRenderer`. Some options can be implementation
  // specific, like `attach` etc. for React, but not part of this interface explicitly.
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  createRenderer(options) {
    switch (options.mode) {
      case EnzymeAdapter.MODES.MOUNT: return this.createMountRenderer(options);
      case EnzymeAdapter.MODES.SHALLOW: return this.createShallowRenderer(options);
      case EnzymeAdapter.MODES.STRING: return this.createStringRenderer(options);
      default:
        throw new Error(`Enzyme Internal Error: Unrecognized mode: ${options.mode}`);
    }
  }

  // converts an RSTNode to the corresponding JSX Pragma Element. This will be needed
  // in order to implement the `Wrapper.mount()` and `Wrapper.shallow()` methods, but should
  // be pretty straightforward for people to implement.
  nodeToElement(node) {
    if (!node || typeof node !== 'object') return null;
    return createElement(node.type, propsWithKeysAndRef(node));
  }

  elementToTree(element) {
    return elementToTree(element);
  }

  nodeToHostNode(node) {
    return findDOMNode(node.instance[INTERNAL]);
  }

  isValidElement(element) {
    return isValidElement(element);
  }

  isValidElementType(type) {
    return (
      typeof type === 'string' ||
      typeof type === 'function' ||
      typeof type === 'object' && type !== null
    );
  }

  isCustomComponent(component) {
    return typeof component === 'function';
  }

  createElement(...args) {
    return createElement(...args);
  }
}

module.exports = RaxAdapter;
