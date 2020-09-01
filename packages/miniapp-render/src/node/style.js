import styleList from './style-list';
import tool from '../utils/tool';

class Style {
  constructor(element) {
    this.__settedStyle = new Set();
    this.__value = {};
    this.__element = element;
  }

  setStyle(val, styleKey) {
    const old = this[styleKey];
    if (val) {
      this.__settedStyle.add(styleKey);
    }

    this.__value[styleKey] = val;
    if (old !== val) {
      const payload = {
        path: `${this.__element._path}.style`,
        value: this.cssText
      };
      this.__element._triggerUpdate(payload);
    }
  }

  get cssText() {
    let cssText = '';
    this.__settedStyle.forEach(key => {
      const val = this[key];
      if (!val) return;
      cssText += `${tool.toDash(key)}: ${val};`;
    });
    return cssText;
  }

  set cssText(styleText = '') {
    this.__settedStyle.forEach(prop => {
      this.removeProperty(prop);
    });

    if (styleText === '') {
      return;
    }

    const rules = styleText.split(';');

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i].trim();
      if (rule === '') {
        continue;
      }

      const [propName, val] = rule.split(':');
      if (typeof val === undefined) {
        continue;
      }
      this.setProperty(propName.trim(), val.trim());
    }
  }

  setCssVariables(styleKey) {
    this.hasOwnProperty(styleKey) || Object.defineProperty(this, styleKey, {
      enumerable: true,
      configurable: true,
      get: () => {
        return this.__value[styleKey] || '';
      },
      set: (val) => {
        this.setStyle(val, styleKey);
      }
    });
  }

  setProperty(name, value) {
    if (name[0] === '-') {
      this.setCssVariables(name);
    } else {
      name = tool.toCamelCase(name);
    }
    if (typeof value === undefined) {
      return;
    }

    if (!value) {
      this.removeProperty(name);
    } else {
      this[name] = value;
    }
  }

  removeProperty(name) {
    name = tool.toCamelCase(name);
    if (!this.__settedStyle.has(name)) {
      return '';
    }

    const value = this[name];
    this[name] = '';
    this.__settedStyle.delete(name);
    return value;
  }

  getPropertyValue(name) {
    if (typeof name !== 'string') return '';

    name = tool.toCamel(name);
    return this[name] || '';
  }
}

/**
 * Set the getters and setters for each property
 */
const properties = {};
styleList.forEach(name => {
  properties[name] = {
    get() {
      return this.__value[name] || '';
    },
    set(value) {
      this.setStyle(value, name);
    },
  };
});
Object.defineProperties(Style.prototype, properties);

export default Style;
