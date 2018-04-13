'use strict';

import normalizeColor from './normalizeColor';

const SUFFIX = 'rem';

function convertUnit(val) {
  if (/^\d+$/.test(val)) {
    return val + SUFFIX;
  }

  return val;
}

function measure(value, key) {
  let direction = [];

  if (typeof value === 'number') {
    direction = [value, value, value, value];
  } else if (typeof value === 'string') {
    direction = value.split(/\s+/);
    switch (direction.length) {
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
  result[topKey] = convertUnit(direction[0]);
  result[rightKey] = convertUnit(direction[1]);
  result[bottomKey] = convertUnit(direction[2]);
  result[leftKey] = convertUnit(direction[3]);

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

  result[key + 'Width'] = direction && convertUnit(direction[0]);
  result[key + 'Style'] = direction && direction[1];
  result[key + 'Color'] = direction && normalizeColor(direction[2]);
  return result;
};

export default {
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
  lineHeight: (value) => {
    if (typeof value === 'number') {
      value += 'rem';
    }
    return {
      lineHeight: value
    };
  },
  fontWeight: (value) => {
    return {
      fontWeight: value.toString()
    };
  }
};
