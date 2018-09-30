"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  data: function data() {
    return {
      ctxClass: 'my-page',
      items: ['11111', '22222'],
      isShow: 0
    };
  },
  mounted: function mounted() {
    console.log('Another Page Mounted');
  },
  onShow: function onShow() {
    console.log('Another Page onShow');
  },
  methods: {
    handleClick: function handleClick() {
      this.items.push(new Date());
      this.isShow++;
      this.ctxClass = '';
    }
  }
};
exports.default = _default;