"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _paragraph = _interopRequireDefault(require("./paragraph"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  props: ['message'],
  components: {
    paragraph: _paragraph.default
  }
};
exports.default = _default;