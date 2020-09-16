import styleList from './style-list';

class Style {
  constructor(element) {
    this.__settedStyle = new Set();
    this.__value = new Map();
    this.__element = element;
  }

  setStyle(val, styleKey) {
    const old = this[styleKey];
    if (val) {
      this.__settedStyle.add(styleKey);
    }
    this.__value.set(styleKey, val);
    if (old !== val && this.__element._isRendered()) {
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
      cssText += `${styleMap.get(key)}: ${val};`;
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
        return this.__value.get(styleKey) || '';
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
      name = styleMap.get(name);
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
    name = styleMap.get(name);
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

    name = styleMap.get(name);
    return this[name] || '';
  }
}

/**
 * Set the getters and setters for each property
 */
const properties = {};
const styleMap = new Map();
Object.keys(styleList).forEach(name => {
  styleMap.set(name, styleList[name]);
  styleMap.set(styleList[name], name);
  properties[name] = {
    get() {
      return this.__value.get(name) || '';
    },
    set(value) {
      this.setStyle(value, name);
    },
  };
});

Object.defineProperties(Style.prototype, properties);

export default Style;
