const stringWidth = require('string-width');

module.exports = (str, width = 20) => {
  const len = stringWidth(str);
  return str + ' '.repeat(width - len);
};
