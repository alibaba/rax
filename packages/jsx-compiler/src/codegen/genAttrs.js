/**
 * Generate attrs as string.
 * @param attrs {Object} Attr object.
 * @return {string} Attr string.
 */
function generateAttrs(attrs = {}) {
  const keys = Object.keys(attrs);
  let ret = '';

  for (let i = 0, l = keys.length; i < l; i ++) {
    const key = keys[i];
    const value = attrs[key];

    if (value === false) {
      continue;
    } else if (value === true) {
      ret += `${key}`;
    } else {
      ret += `${key}="${value}"`;
    }

    if (i !== l - 1) {
      ret += ' ';
    }
  }

  return ret;
}

module.exports = generateAttrs;
