import tool from '../utils/tool';

class Attribute extends Map {
  constructor(element) {
    super();
    this.__element = element;
  }

  set(name, value, immediate = true) {
    const element = this.__element;
    super.set(name, value);

    if (name === 'style') {
      element.style.cssText = value;
    } else if (name.indexOf('data-') === 0) {
      const datasetName = tool.toCamel(name.substr(5));
      element.dataset[datasetName] = value;
    } else if (name !== 'id') {
      const payload = {
        path: `${element._path}.${name}`,
        value: value
      };
      element._triggerUpdate(payload, immediate);
    }
  }

  remove(name) {
    const element = this.__element;

    if (name === 'id') {
      element.id = '';
    } else if (name === 'style') {
      super.set(name, '');
    } else if (name.indexOf('data-') === 0) {
      super.delete(name);
      const datasetName = tool.toCamel(name.substr(5));
      if (element.$__dataset) delete element.dataset[datasetName];
    } else {
      // The Settings for the other fields need to trigger the parent component to update
      super.delete(name);
      const payload = {
        path: `${element._path}.${name}`,
        value: ''
      };
      element._triggerUpdate(payload);
    }
  }
}

export default Attribute;
