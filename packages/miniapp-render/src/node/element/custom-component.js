import Element from '../element';
import cache from '../../util/cache';
import Pool from '../../util/pool';

const pool = new Pool();

class CustomComponent extends Element {
  // Create instance
  static $$create(options, tree) {
    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // 复用 element 节点
      const instance = pool.get();

      if (instance) {
        instance.$$init(options, tree);
        return instance;
      }
    }

    return new CustomComponent(options, tree);
  }

  /**
     * 覆写父类的 $$init 方法
     */
  $$init(options, tree) {
    this.$_behavior = options.componentName;

    super.$$init(options, tree);
  }

  /**
     * 覆写父类的 $$destroy 方法
     */
  $$destroy() {
    super.$$destroy();

    this.$_behavior = null;
  }

  /**
     * 覆写父类的回收实例方法
     */
  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // 复用 element 节点
      pool.add(this);
    }
  }

  get behavior() {
    return this.$_behavior;
  }
}

export default CustomComponent;
