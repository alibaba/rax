const SFC = require('sfc-runtime').default;
/**
 * 支付宝小程序 App 级生命周期
 */
const AppCycle = ['onLaunch', 'onShow', 'onHide', 'onError'];

module.exports = function createApp(obj) {
  const config = obj && obj.default ? obj.default : obj;
  const vm = new SFC(config);

  vm.onLaunch = function(options) {
    config.$appOptions = options;
    if (typeof config.onLaunch === 'function') {
      config.onLaunch.call(this, options);
    }

    if (typeof config.beforeMount === 'function') {
      config.beforeMount.call(this);
    }
    if (typeof config.mounted === 'function') {
      config.mounted.call(this);
    }
  };
  // bind app cycle
  vm.onShow = config.onShow;
  vm.onHide = config.onHide;
  vm.onError = config.onError;

  return vm;
};

function noop() {}
