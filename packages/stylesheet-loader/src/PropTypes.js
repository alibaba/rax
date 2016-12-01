'use strict';

import normalizeColor from './normalizeColor';
const LENGTH_REGEXP = /^[-+]?[0-9]*\.?[0-9]+(px|em|rem|\%)?$/;
const INTEGER_REGEXP = /^[-+]?[0-9]+$/;

let PropTypes = {
  length: createLengthChecker,
  number: createNumberChecker,
  integer: createIntegerChecker,
  oneOf: createEnumChecker,
  color: createColorChecker
};

function createLengthChecker(value = '', prop) {
  value = value.toString();

  if (!value.match(LENGTH_REGEXP)) {
    return new Error(`\`${value}\` is not valid value for property \`${prop}\` (e.g. "16、16rem、16px")`);
  }
  return null;
}

function createNumberChecker(value = '', prop) {
  value = value.toString();
  let match = value.match(LENGTH_REGEXP);

  if (!match || match[1]) {
    return new Error(`\`${value}\` is not valid value for property \`${prop}\` (e.g. "16、24、5.2")`);
  }
  return null;
}

function createIntegerChecker(value = '', prop) {
  value = value.toString();

  if (!value.match(INTEGER_REGEXP)) {
    return new Error(`\`${value}\` is not valid value for property \`${prop}\` (e.g. "16、24、12")`);
  }
  return null;
}

function createEnumChecker(list) {
  return function validate(value, prop) {
    let index = list.indexOf(value);

    if (index < 0) {
      return new Error(`\`${value}\` is not valid value for property \`${prop}\` (e.g. "${list.join('、')}")`);
    }

    return null;
  };
}

function createColorChecker(value, prop) {
  if (typeof value === 'number') {
    return;
  }

  if (normalizeColor(value) === null) {
    return new Error(`\`${value}\` is not valid value for property \`${prop}\` (e.g. "#333、#fefefe、rgb(255, 0, 0)")`);
  }
  return null;
};

export default PropTypes;
