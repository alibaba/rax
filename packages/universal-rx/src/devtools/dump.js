import instance from '../vdom/instance';

const INDENTATION_SIZE = 2;
const MAX_DEPTH = 2;
const MAX_STRING_LENGTH = 50;

/**
 * Dump all Native root views and their content. This function tries
 * it best to get the content but ultimately relies on implementation details
 * of  and will fail in future versions.
 */
function dumpTree() {
  try {
    return getTree();
  } catch (e) {
    return 'Failed to dump tree: ' + e;
  }
}

function getTree() {
  let output = '';
  const rootIds = Object.getOwnPropertyNames(instance.roots);
  for (const rootId of rootIds) {
    const inst = instance.roots[rootId];
    output += `============ Root ID: ${rootId} ============\n`;
    output += dumpNode(inst.getRenderedComponent(), 0);
    output += `============ End root ID: ${rootId} ============\n`;
  }
  return output;
}

function dumpNode(node, identation) {
  const data = getData(node);
  if (data.nodeType === 'Text') {
    return indent(identation) + data.text + '\n';
  } else if (data.nodeType === 'Empty') {
    return '';
  }
  let output = indent(identation) + `<${data.name}`;
  if (data.nodeType === 'Composite') {
    for (const propName of Object.getOwnPropertyNames(data.props || {})) {
      if (isNormalProp(propName)) {
        try {
          const value = convertValue(data.props[propName]);
          if (value) {
            output += ` ${propName}=${value}`;
          }
        } catch (e) {
          const message = `[Failed to get property: ${e}]`;
          output += ` ${propName}=${message}`;
        }
      }
    }
  }
  let childOutput = '';
  for (const child of data.children || []) {
    childOutput += dumpNode(child, identation + 1);
  }

  if (childOutput) {
    output += '>\n' + childOutput + indent(identation) + `</${data.name}>\n`;
  } else {
    output += ' />\n';
  }

  return output;
}

function isNormalProp(name: string): boolean {
  switch (name) {
    case 'children':
    case 'key':
    case 'ref':
      return false;
    default:
      return true;
  }
}

function convertObject(object: Object, depth: number) {
  if (depth >= MAX_DEPTH) {
    return '[...omitted]';
  }
  let output = '{';
  let first = true;
  for (const key of Object.getOwnPropertyNames(object)) {
    if (!first) {
      output += ', ';
    }
    // $FlowFixMe(>=0.28.0)
    output += `${key}: ${convertValue(object[key], depth + 1)}`;
    first = false;
  }
  return output + '}';
}

function convertValue(value, depth = 0): ?string {
  if (!value) {
    return null;
  }

  switch (typeof value) {
    case 'string':
      return JSON.stringify(possiblyEllipsis(value).replace('\n', '\\n'));
    case 'boolean':
    case 'number':
      return JSON.stringify(value);
    case 'function':
      return '[function]';
    case 'object':
      return convertObject(value, depth);
    default:
      return null;
  }
}

function possiblyEllipsis(value: string) {
  if (value.length > MAX_STRING_LENGTH) {
    return value.slice(0, MAX_STRING_LENGTH) + '...';
  } else {
    return value;
  }
}

function indent(size: number) {
  return ' '.repeat(size * INDENTATION_SIZE);
}

function getData(element) {
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
  } else if (element._currentElement === null || element._currentElement === false) {
    nodeType = 'Empty';
  } else if (element._renderedComponent) {
    nodeType = 'NativeWrapper';
    children = [element._renderedComponent];
    props = element._instance.props;
    state = element._instance.state;
    context = element._instance.context;
    if (context && Object.keys(context).length === 0) {
      context = null;
    }
  } else if (element._renderedChildren) {
    children = childrenList(element._renderedChildren);
  } else if (element._currentElement && element._currentElement.props) {
    // This is a native node without rendered children -- meaning the children
    // prop is just a string or (in the case of the <option>) a list of
    // strings & numbers.
    children = element._currentElement.props.children;
  }

  if (!props && element._currentElement && element._currentElement.props) {
    props = element._currentElement.props;
  }

  // != used deliberately here to catch undefined and null
  if (element._currentElement != null) {
    type = element._currentElement.type;
    if (typeof type === 'string') {
      name = type;
    } else if (element.getName) {
      nodeType = 'Composite';
      name = element.getName();
      // 0.14 top-level wrapper
      // TODO(jared): The backend should just act as if these don't exist.
      if (element._renderedComponent && element._currentElement.props === element._renderedComponent._currentElement) {
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

  if (element._instance) {
    // TODO: React ART currently falls in this bucket, but this doesn't
    // actually make sense and we should clean this up after stabilizing our
    // API for backends
    let inst = element._instance;
    if (inst._renderedChildren) {
      children = childrenList(inst._renderedChildren);
    }
  }

  return {
    nodeType,
    type,
    name,
    props,
    state,
    context,
    children,
    text
  };
}

function childrenList(children) {
  var res = [];
  for (var name in children) {
    res.push(children[name]);
  }
  return res;
}

export default dumpTree;
