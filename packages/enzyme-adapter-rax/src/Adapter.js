const { createElement } = require('rax');
const renderer = require('rax-test-renderer');
const { renderToString } = require('rax-server-renderer');
const { default: findDOMNode } = require('rax-find-dom-node');
const { default: isValidElement } = require('rax-is-valid-element');
const { EnzymeAdapter } = require('enzyme');

const CURRENT_ELEMENT = '__currentElement';
const RENDERED_COMPONENT = '_renderedComponent';
const INSTANCE = '_instance';

function childrenList(children) {
  var res = [];
  for (var name in children) {
    res.push(children[name]);
  }
  return res;
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

function instanceToTree(element) {
  var children = null;
  var props = null;
  var state = null;
  var context = null;
  var name = null;
  var type = null;
  var text = null;
  var nodeType = 'Native';
  // If the parent is a native node without rendered children, but with
  // multiple string children, then the `element` that gets passed in here is
  // a plain value -- a string or number.
  if (typeof element !== 'object') {
    nodeType = 'Text';
    text = element + '';
  } else if (element[CURRENT_ELEMENT] === null || element[CURRENT_ELEMENT] === false) {
    nodeType = 'Empty';
  } else if (element[RENDERED_COMPONENT]) {
    nodeType = 'NativeWrapper';
    children = [instanceToTree(element[RENDERED_COMPONENT])];
    props = element[INSTANCE].props;
    state = element[INSTANCE].state;
    context = element[INSTANCE].context;
    if (context && Object.keys(context).length === 0) {
      context = null;
    }
  } else if (element[RENDERED_COMPONENT]) {
    children = childrenList(instanceToTree(element[RENDERED_COMPONENT]));
  } else if (element[CURRENT_ELEMENT] && element[CURRENT_ELEMENT].props) {
    // This is a native node without rendered children -- meaning the children
    // prop is just a string or (in the case of the <option>) a list of
    // strings & numbers.
    children = element[CURRENT_ELEMENT].props.children.map(child => instanceToTree(child));
  }

  if (!props && element[CURRENT_ELEMENT] && element[CURRENT_ELEMENT].props) {
    props = element[CURRENT_ELEMENT].props;
  }

  // != used deliberately here to catch undefined and null
  if (element[CURRENT_ELEMENT] != null) {
    type = element[CURRENT_ELEMENT].type;
    if (typeof type === 'string') {
      name = type;
    } else if (element.getName) {
      nodeType = 'Composite';
      name = element.getName();
      // 0.14 top-level wrapper
      // TODO(jared): The backend should just act as if these don't exist.
      if (element._renderedComponent && element[CURRENT_ELEMENT].props === element._renderedComponent[CURRENT_ELEMENT]) {
        nodeType = 'Wrapper';
      }
      if (name === null) {
        name = 'No display name';
      }
    } else if (element._text) {
      nodeType = 'Text';
      text = element._text;
    } else {
      name = type.displayName || type.name || 'Unknown';
    }
  }

  if (element[INSTANCE]) {
    let inst = element[INSTANCE];
    if (inst[RENDERED_COMPONENT]) {
      children = childrenList(instanceToTree(inst[RENDERED_COMPONENT]));
    }
  }

  const result = {
    nodeType,
    type,
    name,
    props,
    state,
    context,
    children,
    text
  };

  console.log('result', result);

  return result;
}

class RaxAdapter extends EnzymeAdapter {
  constructor() {
    super();

    const { lifecycles } = this.options;
    this.options = {
      ...this.options,
      supportPrevContextArgumentOfComponentDidUpdate: true,
      legacyContextMode: 'parent',
      lifecycles: {
        ...lifecycles,
        componentDidUpdate: {
          prevContext: true,
        },
        getChildContext: {
          calledByRenderer: true,
        },
      },
    };
  }

  createMountRenderer(options) {
    let instance = null;
    return {
      render(el, context, callback) {
        instance = renderer.create(el);
        if (typeof callback === 'function') {
          callback();
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
        return instanceToTree(instance);
      },
      simulateEvent(node, eventName, args) {
        const event = new Event(eventName, {
          bubbles: args.bubbles,
          composed: args.composed,
          cancelable: args.cancelable,
        });
        Object.assign(event, args);

        node.instance.dispatchEvent(event);
      },
      batchedUpdates(fn) {
        fn();
      }
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
      case EnzymeAdapter.MODES.STRING: return this.createStringRenderer(options);
      default:
        throw new Error(`Enzyme Internal Error: Unrecognized mode: ${options.mode}`);
    }
  }

  // converts an RSTNode to the corresponding JSX Pragma Element. This will be needed
  // in order to implement the `Wrapper.mount()` and `Wrapper.shallow()` methods, but should
  // be pretty straightforward for people to implement.
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  nodeToElement(node) {
    if (!node || typeof node !== 'object') return null;
    return createElement(node.type, propsWithKeysAndRef(node));
  }

  nodeToHostNode(node) {
    return findDOMNode(node.instance);
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
