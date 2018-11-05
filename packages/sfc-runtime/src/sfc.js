import {
  mixinComputed,
  mixinProps,
  mixinSlots,
  mixinData,
} from './mixin';
import initWatch from './initWatch';

const installedPlugins = new Set();

export default class SFC {
  constructor(config) {
    if (typeof config !== 'object') {
      throw new TypeError('SFC Config must be an object.');
    }

    if (typeof config.beforeCreate === 'function') {
      config.beforeCreate.call(null);
    }

    Object.defineProperty(this, '_watchers', {
      enumerable: false,
      value: [],
    });

    if (config._global) {
      Object.defineProperty(this, '_global', {
        enumerable: false,
        value: config._global,
      });
    }

    /**
     * Mixins order:
     *  1. _watchers
     *  2. props
     *  3. methods
     *  4. data & observe
     *  5. computed
     *  6. watch
     */
    mixinProps(this, config.propsData, config.props);

    if (config.methods) {
      Object.keys(config.methods).forEach((methodName) => {
        this[methodName] = config.methods[methodName].bind(this);
      });
    }

    mixinData(this, config);
    mixinSlots(this, config.children);

    Object.defineProperty(this, '$options', {
      enumerable: false,
      configurable: true,
      get() {
        return config;
      },
    });

    mixinComputed(this, config.computed);
    initWatch(this, config.watch);

    if (typeof config.created === 'function') {
      config.created.call(this);
    }
  }

  /**
   * Register an SFC plugin
   */
  static use(Plugin, options) {
    if (Plugin == null) {
      throw new TypeError('Plugin should not be undefined or null');
    }

    if (installedPlugins.has(Plugin)) {
      if (process.env.NODE_ENV !== 'production')
        console.error(`SFC: Plugin ${Plugin.name} can not use more than once.`);
      return;
    }

    Plugin.install(SFC, options);
    installedPlugins.add(Plugin);
  }

  /**
   * Need override
   */
  render() {
    return null;
  }

  /**
   * Need override
   */
  forceUpdate() { }
}
