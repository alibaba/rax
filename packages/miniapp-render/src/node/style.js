import styleList from './style-list';
import Pool from '../util/pool';
import cache from '../util/cache';
import tool from '../util/tool';

const pool = new Pool();

/**
 * Parse style string
 */
function parse(styleText) {
  const rules = {};

  if (styleText) {
    styleText = tool.decodeContent(styleText);
    // deal with the semicolon in the value first
    styleText = styleText.replace(/url\([^)]+\)/ig, all => all.replace(/;/ig, ':#||#:'));
    styleText.split(';').forEach(rule => {
      rule = rule.trim();
      if (!rule) return;

      const split = rule.indexOf(':');
      if (split === -1) return;

      const name = tool.toCamel(rule.substr(0, split).trim());
      rules[name] = rule.substr(split + 1).replace(/:#\|\|#:/ig, ';').trim();
    });
  }

  return rules;
}

class Style {
  constructor(onUpdate) {
    this.__settedStyle = {};
    this.$$init(onUpdate);
  }

  static $$create(onUpdate) {
    const config = cache.getConfig();

    if (config.optimization.domExtendMultiplexing) {
      // reuse dom extension objects
      const instance = pool.get();

      if (instance) {
        instance.$$init(onUpdate);
        return instance;
      }
    }

    return new Style(onUpdate);
  }

  // Init instance
  $$init(onUpdate) {
    this.$_doUpdate = onUpdate || (() => {});
    // Whether checking for updates is disabled
    this.$_disableCheckUpdate = false;
  }

  $$destroy() {
    this.$_doUpdate = null;
    this.$_disableCheckUpdate = false;

    styleList.forEach(name => {
      this.__settedStyle[name] = undefined;
    });
  }

  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.domExtendMultiplexing) {
      // reuse dom extension objects
      pool.add(this);
    }
  }

  $_checkUpdate() {
    if (!this.$_disableCheckUpdate) {
      this.$_doUpdate();
    }
  }

  get cssText() {
    return Object.keys(this.__settedStyle).reduce((cssText, name) => {
      if (this.__settedStyle[name]) {
        return cssText + `${tool.toDash(name)}:${this.__settedStyle[name].trim()};`;
      }
      return cssText;
    }, '');
  }

  set cssText(styleText) {
    if (typeof styleText !== 'string') return;

    styleText = styleText.replace(/"/g, '\'');

    // Parse style
    const rules = parse(styleText);

    // Merge the Settings for each rule into an update
    this.$_disableCheckUpdate = true;
    for (const name of styleList) {
      this[name] = rules[name];
    }
    this.$_disableCheckUpdate = false;
    this.$_checkUpdate();
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
      return this.__settedStyle[name] || '';
    },
    set(value) {
      const oldValue = this.__settedStyle[name];
      value = value !== undefined ? '' + value : undefined;

      this.__settedStyle[name] = value;
      if (oldValue !== value) this.$_checkUpdate();
    },
  };
});
Object.defineProperties(Style.prototype, properties);

export default Style;
