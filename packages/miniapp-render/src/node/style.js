import styleList from './style-list';
import Pool from '../util/pool';
import cache from '../util/cache';
import tool from '../util/tool';

const pool = new Pool();

/**
 * 解析样式串
 */
function parse(styleText) {
  const rules = {};

  if (styleText) {
    styleText = tool.decodeContent(styleText);
    styleText = styleText.replace(/url\([^)]+\)/ig, all => all.replace(/;/ig, ':#||#:')); // 先处理值里面的分号
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

  /**
     * 创建实例
     */
  static $$create(onUpdate) {
    const config = cache.getConfig();

    if (config.optimization.domExtendMultiplexing) {
      // 复用 dom 扩展对象
      const instance = pool.get();

      if (instance) {
        instance.$$init(onUpdate);
        return instance;
      }
    }

    return new Style(onUpdate);
  }

  /**
     * 初始化实例
     */
  $$init(onUpdate) {
    this.$_doUpdate = onUpdate || (() => {});
    this.$_disableCheckUpdate = false; // 是否禁止检查更新
  }

  /**
     * 销毁实例
     */
  $$destroy() {
    this.$_doUpdate = null;
    this.$_disableCheckUpdate = false;

    styleList.forEach(name => {
      this.__settedStyle[name] = undefined;
    });
  }

  /**
     * 回收实例
     */
  $$recycle() {
    this.$$destroy();

    const config = cache.getConfig();

    if (config.optimization.domExtendMultiplexing) {
      // 复用 dom 扩展对象
      pool.add(this);
    }
  }

  /**
     * 检查更新
     */
  $_checkUpdate() {
    if (!this.$_disableCheckUpdate) {
      this.$_doUpdate();
    }
  }

  /**
     * 对外属性和方法
     */
  get cssText() {
    const joinText = Object.keys(this.__settedStyle).map(name => `${tool.toDash(name)}:${this.__settedStyle[name]}` ).join(';').trim();
    return joinText ? `${joinText};` : '';
  }

  set cssText(styleText) {
    if (typeof styleText !== 'string') return;

    styleText = styleText.replace(/"/g, '\'');

    // 解析样式
    const rules = parse(styleText);

    this.$_disableCheckUpdate = true; // 将每条规则的设置合并为一次更新
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
 * 设置各个属性的 getter、setter
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
