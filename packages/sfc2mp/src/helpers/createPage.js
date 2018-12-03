const SFC = require('sfc-runtime').default;
/**
 * 小程序 Page 生命周期
 * https://docs.alipay.com/mini/framework/page
 */
const PAGE_LIFECYCLE = [
  'onTitleClick',
  'onOptionMenuClick',
  'onPageScroll',
  // 'onLoad',
  // 'onReady',
  'onShow',
  'onHide',
  // 'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onShareAppMessage',
];

module.exports = function createPage(config, dependencies = {}) {
  const pageDef = {};
  config = requireDefault(config);

  /**
   * initial view-model
   * using a real Vue to support full Vue ability
   */
  const vm = new SFC(config);

  /**
   * life cycle beforeMount & mounted
   * 小程序生命周期函数 this 也指向 vm (by mpvue)
   */
  PAGE_LIFECYCLE.forEach(cycle => {
    if (typeof config[cycle] === 'function') {
      pageDef[cycle] = config[cycle].bind(vm);
    }
  });
  pageDef.onLoad = function(query) {
    // hack and inject Page's this to _self
    pageDef._self = this;
    /**
     * this.$query to fetch onload query
     */
    vm.$query = query;

    if (typeof config.onLoad === 'function') {
      config.onLoad.call(vm, query);
    }
  };
  const pageBeforeMountCallbacks = [];
  const pageMountedCallbacks = [];
  pageDef.onReady = function() {
    if (typeof config.beforeMount === 'function') {
      config.beforeMount.call(vm);
    }
    pageBeforeMountCallbacks.forEach(cb => {
      cb();
    });
    vm._isMounted = true;

    if (typeof config.mounted === 'function') {
      config.mounted.call(vm);
    }
    pageMountedCallbacks.forEach(cb => {
      cb();
    });

    if (typeof config.onReady === 'function') {
      config.onReady.call(vm);
    }
  };

  const pageBeforeDestroyedCallbacks = [];
  const pageDestroyedCallbacks = [];
  pageDef.onUnload = function() {
    pageDef._self = null; // de alloc
    vm._isBeingDestroyed = true;
    if (typeof config.beforeDestroy === 'function') {
      config.beforeDestroy.call(vm);
    }
    pageBeforeDestroyedCallbacks.forEach(cb => {
      cb();
    });
    vm._isMounted = false;
    vm._isDestroyed = true;
    if (typeof config.destroyed === 'function') {
      config.destroyed.call(vm);
    }
    pageDestroyedCallbacks.forEach(cb => {
      cb();
    });
    if (typeof config.onUnload === 'function') {
      config.onUnload.call(vm);
    }
    vm._inactive = true;
  };

  /**
   * methods transfer
   */
  if (typeof config.methods === 'object') {
    const methods = Object.keys(config.methods);
    for (let i = 0, l = methods.length; i < l; i++) {
      pageDef[methods[i]] = config.methods[methods[i]].bind(vm);
    }
  }

  /**
   * watch data changing to setData
   * lifecycle beforeUpdate and updated trigger
   * TODO enhancement: queen & debounce
   * TODO [DIFF TO VUE]: beforeUpdate will not trigger while data not changing
   */
  const beforeUpdate =
    typeof config.beforeUpdate === 'function'
      ? config.beforeUpdate
      : noop;
  const updated =
    typeof config.updated === 'function' ? config.updated : noop;

  Object.keys(vm.$data || {}).forEach(key => {
    vm.$watch(key, function(newVal, oldVal) {
      beforeUpdate.call(vm);
      pageDef._self.setData(
        {
          [key]: newVal,
        },
        function() {
          updated.call(vm);
        }
      );
    });
  });

  /**
   * data definition
   */
  pageDef.data = vm.$data;

  /**
   * dependencies tpl data definition
   */
  pageDef.data.$d = {}; // scope $d
  for (let key in dependencies) {
    if (dependencies.hasOwnProperty(key)) {
      const tplConfig = requireDefault(dependencies[key].config);
      const tplVm = new SFC({
        ...tplConfig,
        propsData: dependencies[key].propsData,
      });

      // lifecycles for components
      if (tplConfig.beforeMount) {
        pageBeforeMountCallbacks.push(
          tplConfig.beforeMount.bind(tplVm)
        );
      }
      if (tplConfig.mounted) {
        pageMountedCallbacks.push(tplConfig.mounted.bind(tplVm));
      }
      if (tplConfig.beforeDestroy) {
        pageBeforeDestroyedCallbacks.push(
          tplConfig.beforeDestroy.bind(tplVm)
        );
      }
      if (tplConfig.destroyed) {
        pageDestroyedCallbacks.push(tplConfig.destroyed.bind(tplVm));
      }

      pageDef.data.$d[key] = {
        ...tplVm.$data,
        ...tplVm.$props,
      };

      /**
       * method pass
       */
      if (tplConfig.methods) {
        Object.keys(tplConfig.methods).forEach(methodName => {
          const methodPropsPassName = `${key}$${methodName}`;
          pageDef[methodPropsPassName] = tplConfig.methods[
            methodName
          ].bind(tplVm);
        });
      }

      /**
       * watch component data change
       */
      const beforeUpdate =
        typeof tplConfig.beforeUpdate === 'function'
          ? tplConfig.beforeUpdate
          : noop;
      const updated =
        typeof tplConfig.updated === 'function'
          ? tplConfig.updated
          : noop;
      Object.keys(tplVm.$data || {}).forEach(dataKey => {
        tplVm.$watch(dataKey, function(newVal, oldVal) {
          const new$d = { ...pageDef.data.$d };
          new$d[key][dataKey] = newVal;
          beforeUpdate.call(tplVm);
          pageDef._self.setData(
            {
              $d: new$d,
            },
            function() {
              updated.call(tplVm);
            }
          );
        });
      });
    }
  }

  return pageDef;
};

function noop() {}

function requireDefault(obj) {
  // commonjs and esm
  return obj && obj.default ? obj.default : obj || {};
}
