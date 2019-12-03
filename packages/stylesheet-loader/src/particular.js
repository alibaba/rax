'use strict';

import normalizeColor from './normalizeColor';

const NUMBER_REG = /^[-+]?\d*\.?\d+$/;

function convertUnit(val) {
  if (NUMBER_REG.test(val)) {
    return parseFloat(val);
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

let toMs = function(value) {
  if (typeof value === 'string') {
    if (/^\./.test(value)) value = '0' + value; // .5s
    if (/s$/.test(value) && !/ms$/.test(value)) { // 1.5s
      value = parseFloat(value) * 1000;
    } else { // 150 or 150ms
      value = parseFloat(value);
    }
  }
  return (value || 0) + 'ms';
};

let transitionProperty = function(value) {
  if (value === 'all') {
    value = 'width,height,top,bottom,left,right,backgroundColor,opacity,transform';
  } else if (value === 'none' || !value) {
    return { isDeleted: true };
  }
  return {
    transitionProperty: value.replace('background-color', 'backgroundColor')
  };
};

let transition = function(value) {
  let result = {
    isDeleted: true
  };
  const options = (value || '')
    .trim()
    .replace(/cubic-bezier\(.*\)/g, ($0) => $0.replace(/\s+/g, '')) // transition: all 0.2s cubic-bezier( 0.42, 0, 0.58, 1 ) 0s
    .split(/\s+/);
  const property = transitionProperty(options[0] || 'all');

  if (!property.isDeleted) result.transitionProperty = property.transitionProperty;
  result.transitionTimingFunction = (options[2] || 'ease').replace(/\s+/g, '');
  result.transitionDuration = toMs(options[1]);
  result.transitionDelay = toMs(options[3]);
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
    return {
      lineHeight: value
    };
  },
  fontWeight: (value) => {
    return {
      fontWeight: value.toString()
    };
  },
  transition: (value) => {
    return transition(value);
  },
  transitionProperty: (value) => {
    return transitionProperty(value);
  },
  transitionDuration: (value) => {
    return {
      transitionDuration: toMs(value)
    };
  },
  transitionDelay: (value) => {
    return {
      transitionDelay: toMs(value)
    };
  },
  transitionTimingFunction: (value) => {
    return {
      transitionTimingFunction: value.replace(/\s+/g, '')
    };
  }
};
