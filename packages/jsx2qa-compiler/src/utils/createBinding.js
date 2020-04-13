module.exports = function createBinding(key, adapter) {
  key = String(key).trim();
  if (key[0] === '{' && key[key.length - 1] === '}') {
    key = ' ' + key + ' '; // Add first and last char. QuickApp use { { a: 1 } } to represent an bindging object.
  }
  return '{{' + key + '}}';
};
