import Pool from '../util/pool';
import cache from '../util/cache';
import tool from '../util/tool';

const pool = new Pool();

class Attribute {
  constructor(element, onUpdate) {
    this.$$init(element, onUpdate);
  }

  static $$create(element, onUpdate) {
    const config = cache.getConfig();

    if (config.optimization.domExtendMultiplexing) {
      const instance = pool.get();

      if (instance) {
        instance.$$init(element, onUpdate);
        return instance;
      }
    }

    return new Attribute(element, onUpdate);
  }

  $$init(element, onUpdate) {
    this.$_element = element;
    this.$_doUpdate = onUpdate;
    this.$_map = {};
    this.$_list = [];

    this.triggerUpdate();
  }

  $$destroy() {
    this.$_element = null;
    this.$_doUpdate = null;
    this.$_map = null;
    this.$_list = null;
  }

  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.domExtendMultiplexing) {
      pool.add(this);
    }
  }

  get list() {
    return this.$_list;
  }

  set(name, value) {
    const element = this.$_element;
    const map = this.$_map;

    if (name === 'id') {
      map.id = value;
    } else if (name === 'class' || element.tagName === 'BUILTIN-COMPONENT' && name === 'className') {
      element.className = value;
    } else if (name === 'style') {
      element.style.cssText = value;
    } else if (name.indexOf('data-') === 0) {
      const datasetName = tool.toCamel(name.substr(5));
      element.dataset[datasetName] = value;
    } else {
      const config = cache.getConfig();

      // 判断 value 是否需要删减
      if (typeof value === 'string' && config.optimization.attrValueReduce && value.length > config.optimization.attrValueReduce) {
        console.warn(`property "${name}" will be deleted, because it's greater than ${config.optimization.attrValueReduce}`);
        value = '';
      }

      map[name] = value;

      this.$_doUpdate();
    }

    this.triggerUpdate();
  }

  get(name) {
    const element = this.$_element;
    const map = this.$_map;

    if (name === 'id') {
      return map.id || '';
    } if (name === 'class') {
      return element.className;
    } else if (name === 'style') {
      return element.style.cssText;
    } else if (name.indexOf('data-') === 0) {
      const datasetName = tool.toCamel(name.substr(5));
      if (!element.$__dataset) return undefined;
      return element.dataset[datasetName];
    } else {
      return map[name];
    }
  }

  has(name) {
    const element = this.$_element;
    const map = this.$_map;

    if (name === 'id') {
      return !!element.id;
    } else if (name === 'class') {
      return !!element.className;
    } else if (name === 'style') {
      return !!element.style.cssText;
    } else if (name.indexOf('data-') === 0) {
      const datasetName = tool.toCamel(name.substr(5));
      if (!element.$__dataset) return false;
      return Object.prototype.hasOwnProperty.call(element.dataset, datasetName);
    } else {
      return Object.prototype.hasOwnProperty.call(map, name);
    }
  }

  remove(name) {
    const element = this.$_element;
    const map = this.$_map;

    if (name === 'id') {
      element.id = '';
    } else if (name === 'class' || name === 'style') {
      this.set(name, '');
    } else if (name.indexOf('data-') === 0) {
      const datasetName = tool.toCamel(name.substr(5));
      if (element.$__dataset) delete element.dataset[datasetName];
    } else {
      // The Settings for the other fields need to trigger the parent component to update
      delete map[name];
      this.$_doUpdate();
    }

    this.triggerUpdate();
  }

  triggerUpdate() {
    const map = this.$_map;
    const list = this.$_list;

    // Empty the old list
    list.forEach(item => {
      delete list[item.name];
    });
    delete list.class;
    delete list.style;
    list.length = 0;

    // Add a new list
    Object.keys(map).forEach(name => {
      if (name !== 'id') {
        const item = {name, value: map[name]};

        list.push(item);
        list[name] = item;
      }
    });

    const idValue = this.get('id');
    const classValue = this.get('class');
    const styleValue = this.get('style');
    if (idValue) {
      const item = {name: 'id', value: idValue};
      list.push(item);
      list.id = item;
    }
    if (classValue) {
      const item = {name: 'class', value: classValue};
      list.push(item);
      list.class = item;
    }
    if (styleValue) {
      const item = {name: 'style', value: styleValue};
      list.push(item);
      list.style = item;
    }
  }
}

export default Attribute;
