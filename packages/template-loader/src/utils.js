export function repeatString(string, times) {
  if (times === 1) {
    return string;
  }
  if (times < 0) {
    throw new Error();
  }
  let repeated = '';
  while (times) {
    if (times & 1) {
      repeated += string;
    }
    if (times >>= 1) {
      string += string;
    }
  }
  return repeated;
}

export function endsWith(haystack, needle) {
  return haystack.slice(-needle.length) === needle;
}

export function trimEnd(haystack, needle) {
  return endsWith(haystack, needle)
    ? haystack.slice(0, -needle.length)
    : haystack;
}

export function hyphenToCamelCase(string) {
  return string.replace(/-(.)/g, (match, chr) => {
    return chr.toUpperCase();
  });
}

export function isEmpty(string) {
  return !/[^\s]/.test(string);
}

export function isConvertiblePixelValue(value) {
  return /^\d+px$/.test(value);
}

export function isNumeric(input) {
  return input !== undefined
    && input !== null
    && (typeof input === 'number' || parseInt(input, 10) == input);
}

export function padding(level, str) {
  return '\n' + new Array(level + 1).join(' ') + str;
}
