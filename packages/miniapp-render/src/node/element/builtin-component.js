import Element from '../element';
import cache from '../../util/cache';
import Pool from '../../util/pool';

const pool = new Pool();

class BuiltInComponent extends Element {
  // Create instance
  static $$create(options, tree) {
    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // Reuse element node
      const instance = pool.get();

      if (instance) {
        instance.$$init(options, tree);
        return instance;
      }
    }

    return new BuiltInComponent(options, tree);
  }

  // Override the parent class's recovery instance method
  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.elementMultiplexing) {
      // Reuse element node
      pool.add(this);
    }
  }

  get behavior() {
    return this.$_attrs.get('behavior') || '';
  }

  set behavior(value) {
    if (typeof value !== 'string') return;

    this.$_attrs.set('behavior', value);
  }
}

export default BuiltInComponent;
