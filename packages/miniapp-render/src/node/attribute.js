import tool from '../utils/tool';

class Attribute {
  constructor(element, onUpdate) {
    this.$$init(element, onUpdate);
  }

  static $$create(element, onUpdate) {
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
  }

  get list() {
    return this.$_list;
  }

  set(name, value, immediate = true) {
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
      map[name] = value;

      const payload = {
        path: `${this.$_element._path}.${name}`,
        value: value
      };
      this.$_doUpdate(payload, immediate);
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
      const payload = {
        path: `${this.$_element._path}.${name}`,
        value: ''
      };
      this.$_doUpdate(payload);
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
