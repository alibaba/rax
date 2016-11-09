'use strict';

const appendRemIfNeeded = require('./appendRemIfNeeded');
const color = require('./normalizeColor');

let measure = function(value, key) {
  if (typeof value === 'number') {
    value = value.toString();
  }
  const direction = value && value.split(' ');
  const topKey = key + 'Top';
  const rightKey = key + 'Right';
  const bottomKey = key + 'Bottom';
  const leftKey = key + 'Left';
  let result = {
    isDeleted: true
  };

  switch (direction.length) {
    case 1:
      direction[1] = direction[2] = direction[3] = direction[0];
      break;
    case 2:
      direction[2] = direction[0];
      direction[3] = direction[1];
      break;
    case 3:
      direction[3] = direction[1];
      break;
    case 4:
      break;
    default:
      return {};
  }

  result[topKey] = direction && appendRemIfNeeded(topKey, direction[0]);
  result[rightKey] = direction && appendRemIfNeeded(rightKey, direction[1]);
  result[bottomKey] = direction && appendRemIfNeeded(bottomKey, direction[2]);
  result[leftKey] = direction && appendRemIfNeeded(leftKey, direction[3]);
  return result;
};

let prefix = function(value, key, isRem) {
  let result = {};
  let word = key.substring(0, 1).toUpperCase() + key.substring(1);

  if (isRem) {
    value = appendRemIfNeeded(key, value);
  }
  result['ms' + word] = value;
  result['moz' + word] = value;
  result['o' + word] = value;
  result['webkit' + word] = value;
  result[key] = value;
  result.isDeleted = true;

  return result;
};
let border = function(key, value) {
  let result = {
    isDeleted: true
  };
  const direction = value && value.split(' ');

  result[key + 'Width'] = direction && appendRemIfNeeded('borderWidth', direction[0]);
  result[key + 'Style'] = direction && direction[1];
  result[key + 'Color'] = direction && color('borderColor', direction[2]);
  return result;
};

module.exports = {
  border: (value) => {
    return border('border', value);
  },
  borderTop: (value) => {
    return border('borderTop', value);
  },
  borderRight: (value) => {
    return border('borderRight', value);
  },
  borderBottom: (value) => {
    return border('borderBottom', value);
  },
  borderLeft: (value) => {
    return border('borderLeft', value);
  },

  padding: (value) => {
    return measure(value, 'padding');
  },

  margin: (value) => {
    return measure(value, 'margin');
  },

  boxShadow: (value) => {
    return prefix(value, 'boxShadow');
  },
  borderRadius: (value) => {
    return prefix(value, 'borderRadius', true);
  },
  userSelect: (value) => {
    return prefix(value, 'userSelect');
  },
  flex: (value) => {
    return prefix(value, 'flex');
  },
  justifyContent: (value) => {
    return prefix(value, 'justifyContent');
  },
  transition: (value) => {
    return prefix(value, 'transition');
  },
  transform: (value) => {
    return prefix(value, 'transform');
  }
};
