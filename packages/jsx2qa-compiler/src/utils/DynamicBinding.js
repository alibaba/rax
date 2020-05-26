const genExpression = require('../codegen/genExpression');

module.exports = class DynamicBinding {
  constructor(prefix) {
    this.prefix = prefix;
    this._map = {};
    this._store = [];
  }

  _generateDynamicName() {
    return this.prefix + this._store.length;
  }

  _bindDynamicValue({
    expression,
    isDirective
  }) {
    const name = this._generateDynamicName();
    this._store.push({
      name,
      value: expression,
      isDirective
    });
    this._map[this._store.length - 1] = expression;
    return name;
  }

  add({
    expression,
    isDirective = false
  }) {
    const keys = Object.keys(this._map);
    if (keys.length === 0) {
      return this._bindDynamicValue({
        expression,
        isDirective
      });
    } else {
      let name;
      keys.some(key => {
        if (genExpression(expression) === genExpression(this._map[key])) {
          name = this._store[key].name;
          return true;
        }
        return false;
      });
      return name ? name : this._bindDynamicValue({
        expression,
        isDirective
      });
    }
  }

  getExpression(name) {
    const target = this._store.find(dynamicItem => dynamicItem.name === name);
    return target ? target.value : null;
  }

  getStore() {
    return this._store;
  }
};
