'use strict';

const normalizeColor = require('./normalizeColor');

let measure = function(value, key) {
  let direction = [];

  if (typeof value === 'number') {
    direction = [value, value, value, value];
  } else if (typeof value === 'string') {
    direction = value.split(/\s+/);
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
  }

  const topKey = key + 'Top';
  const rightKey = key + 'Right';
  const bottomKey = key + 'Bottom';
  const leftKey = key + 'Left';

  let result = {
    isDeleted: true,
  };
  result[topKey] = direction[0];
  result[rightKey] = direction[1];
  result[bottomKey] = direction[2];
  result[leftKey] = direction[3];

  return result;
};

let prefix = function(value, key) {
  let word = key.substring(0, 1).toUpperCase() + key.substring(1);

  let result = {
    isDeleted: true
  };

  result['ms' + word] = value;
  result['webkit' + word] = value;
  result[key] = value;

  return result;
};

let border = function(key, value) {
  let result = {
    isDeleted: true
  };
  const direction = value && value.split(' ');

  result[key + 'Width'] = direction && direction[0];
  result[key + 'Style'] = direction && direction[1];
  result[key + 'Color'] = direction && normalizeColor(direction[2]);
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
    return prefix(value, 'borderRadius');
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
  },
  lineHeight: (value) => {
    if (typeof value === 'number') {
      value += 'rem';
    }
    return {
      lineHeight: value
    };
  }
};
