"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _title = _interopRequireDefault(require("../components/title"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  components: {
    'sfc-title': _title.default
  },
  beforeCreate: function beforeCreate() {
    console.log('page beforeCreate');
  },
  created: function created() {
    console.log('page created');
  },
  beforeMount: function beforeMount() {
    console.log('page beforeMount');
  },
  mounted: function mounted() {
    console.log('page mounted');
  },
  beforeUpdate: function beforeUpdate() {
    console.log('page beforeUpdate');
  },
  updated: function updated() {
    console.log('page updated');
  },
  beforeDestory: function beforeDestory() {
    console.log('page beforeDestory');
  },
  destroyed: function destroyed() {
    console.log('page destroyed');
  },
  onLoad: function onLoad(options) {
    console.log('page onLoad', options);
  },
  data: function data() {
    return {
      name: 'MPSFC'
    };
  },
  methods: {
    changeName: function changeName() {
      console.log(this);
      this.name = 'World';
    },
    navigateTo: function navigateTo() {
      my.navigateTo({
        url: 'subPage?count=100'
      });
    }
  }
};
exports.default = _default;