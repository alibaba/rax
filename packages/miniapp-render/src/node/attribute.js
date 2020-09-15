import tool from '../utils/tool';

class Attribute {
  constructor(element) {
    this.__element = element;
    this.__value = {};
  }

  _setWithOutUpdate(name, value) {
    this.__value[name] = value;
    if (name === 'style') {
      this.__element.style.cssText = value;
    } else if (name.indexOf('data-') === 0) {
      const datasetName = tool.toCamel(name.substr(5));
      this.__element.dataset[datasetName] = value;
    }
  }

  set(name, value, immediate = true) {
    const element = this.__element;
    this.__value[name] = value;

    if (name === 'style') {
      element.style.cssText = value;
    } else if (name.indexOf('data-') === 0) {
      const datasetName = tool.toCamel(name.substr(5));
      element.dataset[datasetName] = value;
    } else {
      const payload = {
        path: `${element._path}.${name}`,
        value: value
      };
      element._triggerUpdate(payload, immediate);
    }
  }

  get(name) {
    const element = this.__element;
    if (name === 'style') {
      return element.style.cssText || null;
    } else if (name.indexOf('data-') === 0) {
      const datasetName = tool.toCamel(name.substr(5));
      return element.dataset[datasetName];
    }
    return this.__value[name] || null;
  }

  get style() {
    return this.__element.style.cssText || undefined;
  }

  get class() {
    return this.__value.class || undefined;
  }

  get id() {
    return this.__value.id || undefined;
  }

  get src() {
    return this.__value.src || undefined;
  }

  has(name) {
    return Object.prototype.hasOwnProperty.call(this.__value, name);
  }

  remove(name) {
    const element = this.__element;
    delete this.__value[name];
    delete this[name];

    if (name === 'style') {
      element.style.cssText = '';
    } else if (name === 'id') {
      element.id = '';
    } else {
      if (name.indexOf('data-') === 0) {
        const datasetName = tool.toCamel(name.substr(5));
        delete element.dataset[datasetName];
      } else {
        const payload = {
          path: `${element._path}.${name}`,
          value: ''
        };
        element._triggerUpdate(payload);
      }
    }
  }
}

export default Attribute;
