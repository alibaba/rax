let didWarnInvalidHydration = false;

const __DEV__ = process.env.NODE_ENV !== 'production';

export function warnForReplacedHydratebleElement(
  parentNode,
  clientNode,
  serverNode,
) {
  if (__DEV__) {
    if (didWarnInvalidHydration) {
      return;
    }

    // should not warn for replace comment, bescause it may be a placeholder from server
    if (serverNode.nodeType === 8) {
      return;
    }

    didWarnInvalidHydration = true;
    warning(
      'Expected server HTML to contain a matching %s in %s, but got %s.',
      getNodeName(clientNode),
      getNodeName(parentNode),
      getNodeName(serverNode)
    );
  }
}

export function warnForDeletedHydratableElement(
  parentNode,
  child,
) {
  if (__DEV__) {
    if (didWarnInvalidHydration) {
      return;
    }

    didWarnInvalidHydration = true;

    warning(
      'Did not expect server HTML to contain a %s in %s.',
      getNodeName(child),
      getNodeName(parentNode),
    );
  }
}

export function warnForInsertedHydratedElement(
  parentNode,
  node
) {
  if (__DEV__) {
    if (didWarnInvalidHydration) {
      return;
    }

    didWarnInvalidHydration = true;

    warning(
      'Expected server HTML to contain a matching %s in %s.',
      getNodeName(node),
      getNodeName(parentNode),
    );
  }
}

/**
 * Concat tagName、 id and class info to help locate a node
 * @param {*} node HTMLElement
 * @returns {string} for example: <div#home.rax-view.home>
 */
function getNodeName(node) {
  // text node don`t have tagName
  if (!node.tagName) {
    return node.nodeName;
  }

  const name = node.tagName.toLowerCase();
  const id = node.id ? '#' + node.id : '';
  const classStr = node.className || '';
  const classList = classStr.split(' ').map((className) => {
    return className ? '.' + className : '';
  });

  return `<${name}${id}${classList.join('')}>`;
}

export let warning = () => {};

if (process.env.NODE_ENV !== 'production') {
  warning = (template, ...args) => {
    if (typeof console !== 'undefined') {
      let argsWithFormat = args.map(item => '' + item);
      argsWithFormat.unshift('Warning: ' + template);
      // Don't use spread (or .apply) directly because it breaks IE9
      Function.prototype.apply.call(console.error, console, argsWithFormat);
    }

    // For works in DevTools when enable `Pause on caught exceptions`
    // that can find the component where caused this warning
    try {
      let argIndex = 0;
      const message = 'Warning: ' + template.replace(/%s/g, () => args[argIndex++]);
      throw new Error(message);
    } catch (e) {}
  };
}
