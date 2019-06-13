const _ = {
  interopRequire: (obj) => {
    return obj && obj.__esModule ? obj.default : obj;
  },
  firstUpperCase: (str) => {
    return str.toLowerCase().replace(/^\S/g, function (s) { return s.toUpperCase(); });
  }
}

module.exports = _;