import tool from '../utils/tool';

class Attribute {
  constructor(element) {
    this.__element = element;
    this.__value = {};
  }

  _setWithOutUpdate(name, value) {
    this.__value[name] = value;
    if (name.indexOf('data-') === 0) {
      const element = this.__element;
      const datasetName = tool.toCamel(name.substr(5));
      element.dataset.set(datasetName, value);
    }
  }

  set(name, value, immediate = true) {
    const element = this.__element;
    this.__value[name] = value;

    if (name === 'style') {
      element.style.cssText = value;
    } else if (name.indexOf('data-') === 0) {
      const datasetName = tool.toCamel(name.substr(5));
      element.dataset.set(datasetName, value);
    } else {
      const payload = {
        path: `${element._path}.${name}`,
        value: value
      };
      element._triggerUpdate(payload, immediate);
    }
  }

  get(name) {
    return this.__value[name];
  }

  has(name) {
    return Object.prototype.hasOwnProperty.call(this.__value, name);
  }

  remove(name) {
    const element = this.__element;
    delete this.__value[name];

    if (name === 'id') {
      element.id = '';
    } else {
      if (name.indexOf('data-') === 0) {
        const datasetName = tool.toCamel(name.substr(5));
        element.dataset.delete(datasetName);
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
