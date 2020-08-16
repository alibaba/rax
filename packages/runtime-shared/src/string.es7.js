/* eslint-disable no-extend-native, no-bitwise */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
export function padEnd(targetLength, padString) {
  targetLength = targetLength >> 0; // floor if number or convert non-number to 0;
  padString = String(typeof padString !== 'undefined' ? padString : ' ');
  if (this.length > targetLength) {
    return String(this);
  } else {
    targetLength = targetLength - this.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
    }
    return String(this) + padString.slice(0, targetLength);
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
export function padStart(targetLength, padString) {
  targetLength = targetLength >> 0; // truncate if number or convert non-number to 0;
  padString = String(typeof padString !== 'undefined' ? padString : ' ');
  if (this.length > targetLength) {
    return String(this);
  } else {
    targetLength = targetLength - this.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); // append to original to ensure we are longer than needed
    }
    return padString.slice(0, targetLength) + String(this);
  }
}

/**
 * polyfill String
 */
export function polyfill(StringConstructor = String) {
  if (!StringConstructor.prototype.padStart) {
    StringConstructor.prototype.padStart = padStart;
  }

  if (!StringConstructor.prototype.padEnd) {
    StringConstructor.prototype.padEnd = padEnd;
  }
}
