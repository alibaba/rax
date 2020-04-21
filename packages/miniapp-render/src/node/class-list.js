import Pool from '../util/pool';
import cache from '../util/cache';

const pool = new Pool();

function ClassList(onUpdate) {
  this.$$init(onUpdate);
}

ClassList.$$create = function(onUpdate) {
  const config = cache.getConfig();

  if (config.optimization.domExtendMultiplexing) {
    const instance = pool.get();

    if (instance) {
      instance.$$init(onUpdate);
      return instance;
    }
  }

  return new ClassList(onUpdate);
};

ClassList.prototype = Object.assign([], {
  $$init(onUpdate) {
    this.$_doUpdate = onUpdate;
  },

  $$destroy() {
    this.$_doUpdate = null;
    this.length = 0;
  },

  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.domExtendMultiplexing) {
      pool.add(this);
    }
  },

  $$parse(className = '') {
    this.length = 0;

    className = className.trim();
    className = className ? className.split(/\s+/) : [];

    for (const item of className) {
      this.push(item);
    }

    this.$_doUpdate();
  },

  item(index) {
    return this[index];
  },

  contains(className) {
    if (typeof className !== 'string') return false;

    return this.indexOf(className) !== -1;
  },

  add(...args) {
    let isUpdate = false;

    for (let className of args) {
      if (typeof className !== 'string') continue;

      className = className.trim();

      if (className && this.indexOf(className) === -1) {
        this.push(className);
        isUpdate = true;
      }
    }

    if (isUpdate) this.$_doUpdate();
  },

  remove(...args) {
    let isUpdate = false;

    for (let className of args) {
      if (typeof className !== 'string') continue;

      className = className.trim();

      if (!className) continue;

      const index = this.indexOf(className);
      if (index >= 0) {
        this.splice(index, 1);
        isUpdate = true;
      }
    }

    if (isUpdate) this.$_doUpdate();
  },

  toggle(className, force) {
    if (typeof className !== 'string') return false;

    className = className.trim();

    if (!className) return false;

    const isNotContain = this.indexOf(className) === -1;
    let action = isNotContain ? 'add' : 'remove';
    action = force === true ? 'add' : force === false ? 'remove' : action;

    if (action === 'add') {
      this.add(className);
    } else {
      this.remove(className);
    }

    return force === true || force === false ? force : isNotContain;
  },

  toString() {
    return this.join(' ');
  },
});

export default ClassList;
