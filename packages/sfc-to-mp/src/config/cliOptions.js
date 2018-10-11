const options = {};

exports.getOption = function get(key) {
  return options[key];
};

exports.setOption = function set(key, val) {
  return options[key] = val;
};
