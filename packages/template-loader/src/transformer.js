import {IF_KEY, FOR_KEY} from './defaultKey';
const FULL_VALUE_REG = /\{\{(.*)\}\}/g;

export const transformFor = (attributes, begin = true) => {
  let output = '';

  hasForKey(attributes, (attribute) => {
    let value = attribute.value.replace(FULL_VALUE_REG, '$1');
    value = value.split(' in ');

    // fall short of rule eg. '{{item in items}}'
    if (!value[0] || !value[1]) {
      return '';
    }

    if (begin) {
      output += `{${value[1]}.map((${value[0]}) => {return (`;
    } else {
      output = ');})}';
    }
  });

  return output;
};

// transform if block
export const transformIf = (attributes, begin = true) => {
  let output = '';

  hasIfKey(attributes, (attribute) => {
    if (begin) {
      output += `{(${attribute.value.replace(FULL_VALUE_REG, '$1')}) && `;
    } else {
      output = '}';
    }
  });

  return output;
};

export const transformImport = (name, from) => {
  return `import ${name} from '${from}';`;
};

export const hasIfKey = (attributes, callback) => {
  return hasKey(IF_KEY, attributes, callback);
};

export const hasForKey = (attributes, callback) => {
  return hasKey(FOR_KEY, attributes, callback);
};

const hasKey = (keyName, attributes = [], callback) => {
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
