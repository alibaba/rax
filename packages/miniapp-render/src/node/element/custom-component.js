import Element from '../element';
import cache from '../../util/cache';
import Pool from '../../util/pool';

const pool = new Pool();

class CustomComponent extends Element {
  // Create instance
  static $$create(options, tree) {
    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      const instance = pool.get();

      if (instance) {
        instance.$$init(options, tree);
        return instance;
      }
    }

    return new CustomComponent(options, tree);
  }

  $$init(options, tree) {
    this.$_behavior = options.componentName;

    super.$$init(options, tree);
  }

  $$destroy() {
    super.$$destroy();

    this.$_behavior = null;
  }

  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      pool.add(this);
    }
  }

  get behavior() {
    return this.$_behavior;
  }
}

export default CustomComponent;
