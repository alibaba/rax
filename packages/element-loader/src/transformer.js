import * as babylon from 'babylon';
import generate from 'babel-generator';
import traverse from 'babel-traverse';
import { IF_KEY, FOR_KEY } from './defaultKey';

const FULL_VALUE_REG = /\{\{(.*)\}\}/g;

export const transformFor = (attributes, begin = true, scope = {}) => {
  let output = '';

  hasForKey(attributes, (attribute) => {
    let value = attribute.value.replace(FULL_VALUE_REG, '$1');
    value = value.split(' in ');

    // fall short of rule eg. '{{item in items}}'
    if (!value[0] || !value[1]) {
      return '';
    }

    if (begin) {
      scope[value[0]] = 1;
      output += `{props.${value[1]}.map((${value[0]}) => {return (`;
    } else {
      scope[value[0]] = null;
      delete scope[value[0]];
      output = ');})}';
    }
  });

  return output;
};

// transform if block
export const transformIf = (attributes, begin = true, scope) => {
  let output = '';

  hasIfKey(attributes, (attribute) => {
    if (begin) {
      output += `{(${attribute.value.replace(FULL_VALUE_REG, (word, $1) => {
        return transformPair($1, scope);
      })}) && `;
    } else {
      output = '}';
    }
  });

  return output;
};

export const hasIfKey = (attributes, callback) => {
  return hasKey(IF_KEY, attributes, callback);
};

export const hasForKey = (attributes, callback) => {
  return hasKey(FOR_KEY, attributes, callback);
};

const hasKey = (keyName, attributes = [], callback = () => {}) => {
  let hasKey = false;
  attributes = Array.from(attributes);

  attributes.forEach((attribute) => {
    if (attribute.name === keyName) {
      hasKey = true;
      callback(attribute);
    }
  });

  return hasKey;
};

export function transformPair(code, scope, config = {}) {
  const visitor = {
    noScope: 1,
    enter(path) {
      const { node, parent } = path;
      if (node.type !== 'Identifier') {
        return;
      }
      const type = parent && parent.type;
      if (
        (
          type !== 'MemberExpression' ||
          parent.object === node ||

            parent.property === node &&
            parent.computed

        ) &&
        (
          type !== 'ObjectProperty' ||
          parent.key !== node
        ) &&

          !findScope(scope, node.name)

      ) {
        node.name = `props.${node.name}`;
      }
    }
  };

  let codeStr = code;

  const ast = babylon.parse(`(${codeStr})`);
  traverse(ast, visitor);
  let newCode = generate(ast).code;
  if (newCode.charAt(newCode.length - 1) === ';') {
    newCode = newCode.slice(0, -1);
  }

  return `(${newCode})`;
}

function findScope(scope, name) {
  return scope[name];
}
