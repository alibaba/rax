import Host from '../vdom/host';
import getComponentTree from './getComponentTree';

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
    return getDumpTree();
  } catch (e) {
    return 'Failed to dump tree: ' + e;
  }
}

function getDumpTree() {
  let output = '';
  const rootIds = Object.getOwnPropertyNames(Host.rootComponents);
  for (const rootId of rootIds) {
    const inst = Host.rootInstances[rootId];
    output += `============ Root ID: ${rootId} ============\n`;
    output += dumpNode(inst.getRenderedComponent(), 0);
    output += `============ End root ID: ${rootId} ============\n`;
  }
  return output;
}

function dumpNode(node, identation) {
  const data = getComponentTree(node);
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

export default dumpTree;
