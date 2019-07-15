module.exports = function createBinding(key) {
  key = String(key).trim();
  if (key[0] === '{' && key[key.length - 1] === '}') {
    key = key.slice(1, -1); // Remove first and last char. MiniApp use {{ a: 1 }} to represent an bindging object.
  }

  return '{{' + key + '}}';
};
