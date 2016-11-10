'use strict';

import emptyFunction from './emptyFunction';
import warning from './warning';

const isDev = typeof __DEV__ === 'boolean' && __DEV__;
const ANONYMOUS = '<<anonymous>>';

let PropTypes = {
  number: createBasicChecker('number'),
  string: createBasicChecker('string'),

  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker
};

function PropTypeError(message) {
  this.message = message;
  this.stack = '';
}
PropTypeError.prototype = Error.prototype;

function createChainableTypeChecker(validate) {
  let manualPropTypeCallCache;
  if (isDev) {
    manualPropTypeCallCache = {};
  }
  function checkType(isRequired, props, propName, componentName, location, propFullName) {
    componentName = componentName || ANONYMOUS;
    propFullName = propFullName || propName;
    return validate(props, propName, componentName, location, propFullName);
  }

  let chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createBasicChecker(expectedType) {
  function validate( props, propName, componentName, location, propFullName) {
    let propValue = props[propName];
    let propType = getPropType(propValue);
    if (propType !== expectedType) {
      let preciseType = getPropType(propValue);

      return new PropTypeError(
        `Invalid \`${propFullName}\` of type ` +
        `\`${preciseType}\` supplied to \`${componentName}\`, expected ` +
        `\`${expectedType}\`.`
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  if (!Array.isArray(expectedValues)) {
    warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.');
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    let propValue = props[propName];
    for (let i = 0; i < expectedValues.length; i++) {
      if (is(propValue, expectedValues[i])) {
        return null;
      }
    }

    let valuesString = JSON.stringify(expectedValues);
    return new PropTypeError(
      `Invalid \`${propFullName}\` of value \`${propValue}\` ` +
      `supplied to \`${componentName}\`, expected one of ${valuesString}.`
    );
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  if (!Array.isArray(arrayOfTypeCheckers)) {
    warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.');
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    for (let i = 0; i < arrayOfTypeCheckers.length; i++) {
      let checker = arrayOfTypeCheckers[i];
      if (
        checker(props, propName, componentName, location) == null
      ) {
        return null;
      }
    }

    return new PropTypeError(
      `Invalid \`${propFullName}\` supplied to \`${componentName}\`.`
    );
  }
  return createChainableTypeChecker(validate);
}

function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function getPropType(propValue) {
  let propType = typeof propValue;
  return propType;
}

export default PropTypes;
