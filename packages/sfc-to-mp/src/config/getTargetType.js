// target is oneOf('ali', 'wx')
const TARGET_TYPE_KEY = 'TARGET';
const DEFAULT_TARGET_TYPE = 'ali';

module.exports = function getTargetType() {
  return process.env[TARGET_TYPE_KEY] || DEFAULT_TARGET_TYPE;
};
